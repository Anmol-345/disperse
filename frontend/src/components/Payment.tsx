import Ether from "./Ether";

type PaymentProps = {
  address: string;
};

const Payment = ({ address }: PaymentProps) => {

  return (
    <div className="fade-in">
      <Ether address={address} />
    </div>
  );
};

export default Payment;
