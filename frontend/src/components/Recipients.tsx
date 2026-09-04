type RecipientsProps = {
  tokenSymbol: string | null;
  textValue: string;
  setTextValue: React.Dispatch<React.SetStateAction<string>>;
};

const Recipients = ({
  tokenSymbol,
  textValue,
  setTextValue,
}: RecipientsProps) => {
  return (
    <div className="fade-in" style={{ marginTop: "40px" }}>
      <p className="dp-label">recipients &amp; amounts</p>
      <p
        style={{
          fontSize: "0.85rem",
          color: "var(--gray-dark)",
          marginBottom: "14px",
          lineHeight: 1.7,
        }}
      >
        One address and amount ({tokenSymbol}) per line. Supports <em>comma</em>, <em>space</em>,{" "}
        <em>tab</em>, or <em>=</em> as separator.
      </p>
      <textarea
        id="recipients-textarea"
        spellCheck={false}
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
        className="dp-textarea"
        rows={7}
        placeholder={`0x2b1F577230F4D72B3818895688b66abD9701B4dC 1.41421\n0x2b1F577230F4D72B3818895688b66abD9701B4dC,1.41421\n0x2b1F577230F4D72B3818895688b66abD9701B4dC=1.41421`}
      />
    </div>
  );
};

export default Recipients;
