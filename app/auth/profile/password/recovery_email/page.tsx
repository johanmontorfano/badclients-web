import { BsSendCheck } from "react-icons/bs";

export default function Page() {
    return (
        <div className="card">
            <div className="card-body">
                <div className="flex items-center mb-4">
                    <BsSendCheck size={30} className="mr-4" />
                    <h1 className="text-2xl">Reset link sent!</h1>
                </div>
                <p>To reset your password, click the link we sent.</p>
                <p>
                    Look into your inbox for an e-mail sent by{" "}
                    <code>no-reply@johanmontorfano.com</code>
                </p>
            </div>
        </div>
    );
}
