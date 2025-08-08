import Link from "next/link";

// A button that redirects to the appropriate endpoint depending on the choosen
// pricing offer.
export function PricingButton(props: {
    url: string;
    curr: "USD" | "EUR";
}) {
    return (
        <Link
            className="btn btn-primary btn-block"
            href={`${props.url}&curr=${props.curr}`}
        >
            Continue
        </Link>
    );
}
