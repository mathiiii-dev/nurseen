import CustomNavbar from "./customnavbar";
import {Container} from "@mantine/core";

export default function Layout({children}) {
    return (
        <>
            <CustomNavbar/>
            <Container>{children}</Container>
        </>
    );
}