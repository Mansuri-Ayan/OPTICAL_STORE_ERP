import React, { useState, useEffect } from 'react';
import {
  Package,
  Eye,
  Plus,
  Trash2,
  Search,
  Scan,
  PartyPopper,
  Printer,
  RotateCcw,
  CheckCircle2,
  ShoppingBag,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCartStore } from '@/store/cart.store';
import { useStoreStore } from '@/store/store.store';
import { WizardStepper } from '@/components/pos/WizardStepper';
import { OpticalPrescriptionForm } from '@/components/optical/OpticalPrescriptionForm';
import { useProducts } from '@/hooks/useProducts';
import { useCustomers } from '@/hooks/useCustomers';
import { inventoryApi } from '@/api/inventory.api';
import { salesApi } from '@/api/sales.api';
import { Button } from '@/components/ui/Button';
import { Product } from '@/types/product.types';

export const POSWizardPage: React.FC = () => {
  const { selectedStore } = useStoreStore();
  const {
    cart,
    wizardStep,
    wizardCustomer,
    wizardPrescription,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setWizardStep,
    setWizardCustomer,
    setWizardPrescription,
    resetWizard,
    getCartSubtotal,
  } = useCartStore();

  // Search & Catalog states
  const [productSearch, setProductSearch] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success completed order state
  const [completedOrder, setCompletedOrder] = useState<{
    id: string | number;
    invoice_number: string;
    total: number;
    paid: number;
    due: number;
    customer_name: string;
  } | null>(null);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'CARD' | 'SPLIT'>('CASH');
  const [receivedAmount, setReceivedAmount] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [upiRef, setUpiRef] = useState<string>('');
  const [cardRef, setCardRef] = useState<string>('');
  const [expectedDate, setExpectedDate] = useState<string>(
    new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] || ''
  );

  // Fetch products & customers
  const { data: productsData, isLoading: productsLoading } = useProducts({
    search: productSearch,
    limit: 30,
  });
  const { data: customersData, isLoading: customersLoading } = useCustomers({
    search: customerSearch,
    limit: 10,
  });

  const products = productsData?.items || [];
  const customers = customersData?.items || [];

  // Calculations
  const subtotal = getCartSubtotal();
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const cgst = Number((discountedSubtotal * 0.09).toFixed(2));
  const sgst = Number((discountedSubtotal * 0.09).toFixed(2));
  const totalAmount = Number((discountedSubtotal + cgst + sgst).toFixed(2));
  const remainingAmount = Math.max(0, totalAmount - receivedAmount);

  // Auto initialize receivedAmount to totalAmount when total updates
  useEffect(() => {
    setReceivedAmount(totalAmount);
  }, [totalAmount]);

  // Barcode quick scan
  const handleBarcodeScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    try {
      const unit = await inventoryApi.lookupProductUnit(barcodeInput.trim());
      if (unit) {
        const dummyProduct: Product = {
          id: unit.product_id,
          name: unit.product_name,
          brand_name: unit.brand_name,
          category_name: unit.category_name,
          sku: unit.sku,
          selling_price: unit.selling_price || 0,
          base_price: unit.cost_price || 0,
          category_id: 1,
          brand_id: 1,
          is_active: true,
          admin_id: 1,
          created_at: unit.created_at,
        };
        addToCart(dummyProduct, 1, unit.color, unit.size);
        toast.success(`Scanned: ${unit.product_name}`);
        setBarcodeInput('');
      }
    } catch {
      toast.error('Barcode not found in inventory');
    }
  };

  // Submit sale order
  const handleCompleteOrder = async () => {
    if (!selectedStore?.id) {
      toast.error('Please select an active store branch');
      return;
    }
    if (cart.length === 0) {
      toast.error('Cart cannot be empty');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        store_id: selectedStore.id,
        customer_id: wizardCustomer?.id || 1,
        items: cart.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          color: item.selectedColor,
          size: item.selectedSize,
        })),
        subtotal,
        cgst,
        sgst,
        discount_amount: discountAmount,
        total_amount: totalAmount,
        net_amount: totalAmount,
        paid_amount: receivedAmount,
        remaining_amount: remainingAmount,
        payment_method: paymentMethod,
        payments: [
          {
            payment_method: paymentMethod,
            amount: receivedAmount,
            reference_number: paymentMethod === 'UPI' ? upiRef : paymentMethod === 'CARD' ? cardRef : undefined,
          },
        ],
        status: 'Completed',
        lab_status: wizardPrescription ? 'Confirmed' : undefined,
        expected_delivery_date: expectedDate,
        prescription: wizardPrescription || undefined,
      };

      const sale = await salesApi.createSale(payload);
      setCompletedOrder({
        id: sale.id,
        invoice_number: sale.invoice_number,
        total: totalAmount,
        paid: receivedAmount,
        due: remainingAmount,
        customer_name: wizardCustomer?.name || 'Walk-in Customer',
      });
      resetWizard();
      toast.success('Optical sale completed successfully!');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create sale';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success celebration screen
  if (completedOrder) {
    return (
      <div className="p-4 sm:p-8 max-w-xl mx-auto min-h-[60vh] flex items-center justify-center font-sans">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 text-center space-y-6 animate-fade-in w-full">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
            <PartyPopper className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Order Created Successfully!</h1>
            <p className="text-xs text-slate-500 mt-1">Invoice #{completedOrder.invoice_number} is ready</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Customer</span>
              <span className="font-bold text-slate-800">{completedOrder.customer_name}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Total Bill</span>
              <span className="font-bold text-slate-900">₹{completedOrder.total.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Paid Amount</span>
              <span className="font-bold text-emerald-600">₹{completedOrder.paid.toLocaleString('en-IN')}</span>
            </div>
            {completedOrder.due > 0 && (
              <div className="flex justify-between py-1 border-t border-slate-200 pt-1 text-rose-600">
                <span className="font-bold">Balance Due</span>
                <span className="font-bold">₹{completedOrder.due.toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                salesApi.getSaleBillHtml(completedOrder.id).then((html) => {
                  const printWin = window.open('', '_blank');
                  if (printWin) {
                    printWin.document.write(html);
                    printWin.document.close();
                    printWin.print();
                  }
                });
              }}
              icon={<Printer className="w-4 h-4" />}
            >
              Print Receipt
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={() => setCompletedOrder(null)}
              icon={<RotateCcw className="w-4 h-4" />}
            >
              New Order
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto font-sans space-y-6 animate-fade-in">
      {/* Top Title & Active Store Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="w-7 h-7 text-indigo-600" />
            Optical POS Terminal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            4-step guided dispensing wizard: catalog, patient records, optometry powers & split settlement
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700">
          <span>Branch:</span>
          <span>{selectedStore?.name || 'Main Branch'}</span>
        </div>
      </div>

      {/* Stepper Navigation */}
      <WizardStepper currentStep={wizardStep} onStepClick={setWizardStep} />

      {/* STEP 0: PRODUCT SELECTION & LIVE CART */}
      {wizardStep === 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Products Column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search and Barcode Scanner inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search frames, lenses, sunglasses..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <form onSubmit={handleBarcodeScan} className="relative flex gap-2">
                <div className="relative flex-1">
                  <Scan className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Scan unit barcode..."
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs font-mono font-bold rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <Button type="submit" variant="secondary" size="sm">
                  Scan
                </Button>
              </form>
            </div>

            {/* Product Grid */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm min-h-[400px]">
              {productsLoading ? (
                <div className="flex items-center justify-center py-20 text-xs text-slate-400 font-semibold">
                  Loading optical catalog...
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-2">
                  <Package className="w-8 h-8 text-slate-300" />
                  <p className="text-xs text-slate-500 font-semibold">No optical products found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {products.map((p) => {
                    const price = p.selling_price || p.base_price || 0;
                    return (
                      <div
                        key={p.id}
                        className="p-3.5 border border-slate-100 rounded-xl hover:border-indigo-200 hover:shadow-md transition-all flex flex-col justify-between bg-slate-50/50"
                      >
                        <div>
                          <div className="flex justify-between items-start gap-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              {p.brand_name || 'Generic'}
                            </span>
                            <span className="text-xs font-mono font-black text-indigo-700">
                              ₹{price.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-800 line-clamp-1 mt-0.5">{p.name}</h4>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">SKU: {p.sku || 'N/A'}</p>
                        </div>

                        <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            In Stock
                          </span>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => addToCart(p, 1)}
                            className="!px-2.5 !py-1 text-xs"
                          >
                            <Plus className="w-3.5 h-3.5 mr-1" /> Add
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Cart Sidebar Column */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-800">Dispensing Cart</h3>
              </div>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-[11px] font-bold text-rose-500 hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <Package className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-400 font-medium">Cart is currently empty</p>
                <p className="text-[11px] text-slate-400">Select frames or lenses from the left</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{item.product.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">
                        ₹{item.unitPrice.toLocaleString('en-IN')} &times; {item.quantity}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="text-xs font-mono font-bold w-4 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-slate-100"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="w-6 h-6 rounded-lg text-rose-500 hover:bg-rose-50 flex items-center justify-center ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Cart summary footer */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Est. GST (18%)</span>
                <span>₹{(subtotal * 0.18).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-100 pt-2">
                <span>Estimated Total</span>
                <span>₹{(subtotal * 1.18).toFixed(2)}</span>
              </div>

              <Button
                variant="primary"
                fullWidth
                disabled={cart.length === 0}
                onClick={() => setWizardStep(1)}
                className="mt-2"
              >
                Proceed to Customer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: CUSTOMER IDENTIFICATION & FAMILY LINKS */}
      {wizardStep === 1 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-800">Identify Patient / Customer</h2>
              <p className="text-xs text-slate-500">Search existing records or link to family members</p>
            </div>
            {wizardCustomer && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Selected: {wizardCustomer.name}
              </span>
            )}
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patient by name or phone (+91...)"
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Customer list results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
            {customersLoading ? (
              <div className="col-span-2 text-center py-10 text-xs text-slate-400">Loading patients...</div>
            ) : customers.length === 0 ? (
              <div className="col-span-2 text-center py-10 text-xs text-slate-400">No matching patients found</div>
            ) : (
              customers.map((c) => {
                const isSelected = wizardCustomer?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setWizardCustomer(c)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                        : 'border-slate-100 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{c.name}</h4>
                      <p className="text-[11px] font-mono text-slate-500 mt-0.5">{c.phone}</p>
                      {c.city && <p className="text-[10px] text-slate-400">{c.city}</p>}
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />}
                  </div>
                );
              })
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setWizardStep(0)}>
              Back to Products
            </Button>
            <Button
              variant="primary"
              disabled={!wizardCustomer}
              onClick={() => {
                if (wizardCustomer?.prescription) {
                  setWizardPrescription(wizardCustomer.prescription);
                }
                setWizardStep(2);
              }}
            >
              Continue to Prescription
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: OPTICAL PRESCRIPTION FORM */}
      {wizardStep === 2 && (
        <div className="max-w-5xl mx-auto">
          <OpticalPrescriptionForm
            prescription={wizardPrescription}
            onBack={() => setWizardStep(1)}
            onNext={(rx) => {
              setWizardPrescription(rx);
              setWizardStep(3);
            }}
            onSkip={() => {
              setWizardPrescription(null);
              setWizardStep(3);
            }}
          />
        </div>
      )}

      {/* STEP 3: PAYMENT, TAXES & SPLIT SETTLEMENT */}
      {wizardStep === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {/* Payment controls */}
          <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="pb-3 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-slate-800">Payment & Settlement</h2>
                <p className="text-xs text-slate-500">Choose payment mode and record advances</p>
              </div>
              <span className="text-xs font-mono font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                Total: ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Payment method selection */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {(['CASH', 'UPI', 'CARD'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                      paymentMethod === method
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Method specific fields */}
            {paymentMethod === 'UPI' && (
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  UPI Transaction Ref / ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. UPI-2026-987654"
                  value={upiRef}
                  onChange={(e) => setUpiRef(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            {paymentMethod === 'CARD' && (
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Card Auth / POS Approval Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. AUTH-4821"
                  value={cardRef}
                  onChange={(e) => setCardRef(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            {/* Advance vs Due inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Received Amount (Advance)
                </label>
                <input
                  type="number"
                  min="0"
                  max={totalAmount}
                  value={receivedAmount}
                  onChange={(e) => setReceivedAmount(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-mono font-bold rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-emerald-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Discount (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-mono font-bold rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Expected Delivery Date */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Expected Spectacles Delivery Date
              </label>
              <input
                type="date"
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <Button variant="outline" onClick={() => setWizardStep(2)}>
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleCompleteOrder}
                loading={isSubmitting}
                className="!bg-emerald-600 hover:!bg-emerald-700"
              >
                Complete Sale & Generate Bill
              </Button>
            </div>
          </div>

          {/* Breakdown summary */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider pb-2 border-b border-slate-100">
              Order Breakdown
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Items Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>CGST (9%)</span>
                <span>₹{cgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>SGST (9%)</span>
                <span>₹{sgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-100 pt-2">
                <span>Net Total</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-emerald-600">
                <span>Paid Now</span>
                <span>₹{receivedAmount.toLocaleString('en-IN')}</span>
              </div>
              {remainingAmount > 0 && (
                <div className="flex justify-between text-xs font-black text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">
                  <span>Balance Due on Delivery</span>
                  <span>₹{remainingAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            {wizardPrescription && (
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-[11px] space-y-1">
                <span className="font-bold text-indigo-800 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> Rx Attached:
                </span>
                <p className="text-indigo-600 font-mono">
                  OD: {wizardPrescription.rightEye.sph}/{wizardPrescription.rightEye.cyl}&deg;
                  <br />
                  OS: {wizardPrescription.leftEye.sph}/{wizardPrescription.leftEye.cyl}&deg;
                </p>
                <span className="text-[10px] text-indigo-500 block">Lab ticket will auto-generate upon checkout</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default POSWizardPage;
