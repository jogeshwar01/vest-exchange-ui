import { OrderType } from "../../utils/types";

interface OrderTypeBarProps {
  orderType: OrderType;
  setOrderType: React.Dispatch<React.SetStateAction<OrderType>>;
}

const OrderTypeBar: React.FC<OrderTypeBarProps> = ({
  orderType,
  setOrderType,
}) => {
  return (
    <div className="inline-flex h-[38px] w-full justify-center text-muted-foreground border-b border-border">
      <button
        type="button"
        className={`inline-flex cursor-pointer flex-1 items-center justify-center whitespace-nowrap px-4 py-2 font-mono text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-b border-border ${
          orderType === OrderType.MARKET
            ? "border-primary text-primary [text-shadow:_0_0_30px_rgb(255,90,68)]"
            : ""
        }`}
        onClick={() => setOrderType(OrderType.MARKET)}
      >
        MARKET
      </button>
      <button
        type="button"
        className={`inline-flex flex-1 cursor-pointer items-center justify-center whitespace-nowrap px-4 py-2 font-mono text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-b border-border ${
          orderType === OrderType.LIMIT
            ? "border-primary text-primary [text-shadow:_0_0_30px_rgb(255,90,68)]"
            : ""
        }`}
        onClick={() => setOrderType(OrderType.LIMIT)}
      >
        LIMIT
      </button>
    </div>
  );
};

export default OrderTypeBar;
