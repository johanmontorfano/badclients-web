import { Navbar } from "@/components/navbar/navbar";

export default function MainLayout(props: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            {props.children}
        </>
    );
}
