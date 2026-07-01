
export default function RegisterLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <div className=" flex-col items-center justify-center min-h-screen py-2">
            {children}
        </div>
    );
}
