import CustomNavbar from "./customnavbar";

export default function Layout({children}) {
    return (
        <>
            <CustomNavbar/>
            <main>{children}</main>
        </>
    );
}