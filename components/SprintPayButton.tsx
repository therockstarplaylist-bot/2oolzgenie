"use client";

/** Same POST _xclick pattern as shop goPaypal — more reliable than a GET link. */
export function SprintPayButton({
  amount = 297,
  label = "Founder Clarity Sprint — Toolz Genie",
  business = "theopenmindfold@gmail.com",
}: {
  amount?: number;
  label?: string;
  business?: string;
}) {
  function pay() {
    const ret =
      typeof window !== "undefined"
        ? window.location.origin + "/sprint?paid=sprint297"
        : "https://www.2oolzgenie.com/sprint?paid=sprint297";
    const cancel = ret.split("?")[0];
    const f = document.createElement("form");
    f.method = "POST";
    f.action = "https://www.paypal.com/cgi-bin/webscr";
    const fields: Record<string, string> = {
      cmd: "_xclick",
      business,
      item_name: label,
      item_number: "sprint297",
      amount: Number(amount).toFixed(2),
      currency_code: "USD",
      no_shipping: "1",
      no_note: "0",
      rm: "1",
      return: ret,
      cancel_return: cancel,
      charset: "utf-8",
      lc: "US",
    };
    for (const [k, v] of Object.entries(fields)) {
      const i = document.createElement("input");
      i.type = "hidden";
      i.name = k;
      i.value = v;
      f.appendChild(i);
    }
    document.body.appendChild(f);
    f.submit();
  }

  return (
    <button type="button" className="btn" onClick={pay}>
      Pay ${amount} with PayPal
    </button>
  );
}
