
export function PaymentProcessing() {
  return (
    <div className="py-8 flex flex-col items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-primary/20 mb-4"></div>
        <p>Processing payment...</p>
      </div>
    </div>
  );
}
