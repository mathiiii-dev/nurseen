import {
    Button,
    Grid,
    Space,
    Title,
    TextInput,
    Alert,
    PasswordInput
} from "@mantine/core";
import {useState} from "react";
import {useForm} from "@mantine/hooks";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import {useRouter} from 'next/router';
import {getCsrfToken, signIn, } from "next-auth/react";

export default function SignIn() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');
    const [error, setError] = useState(false);

    const form = useForm({
        initialValues: {
            email: '',
            password: ''
        },

        validationRules: {
            email: (value) => /^\S+@\S+$/.test(value),
            password: (password) => password !== ''
        },

        errorMessages: {
            email: 'Email invalide',
            password: 'Veuillez saisir un mot de passe'
        }
    });

    return (
        <>
            <Grid style={{backgroundColor: '#f4fdfc', borderRadius: 11, padding: 25}}>
                <Grid.Col md={12} style={{padding: 25}}>
                    <Title>Connexion</Title>
                    {
                        error ?
                            <Alert title="Erreur!" color="red" withCloseButton closeButtonLabel="Close alert"
                                   onClose={() => {
                                       setError(false)
                                   }}>
                                {errorMessage}
                            </Alert> : ''
                    }
                    <Space h={"xl"}/>
                    <form onSubmit={async (event) => {
                        event.preventDefault()
                        const res = await signIn('credentials', {
                            redirect: false,
                            email: form.values.email,
                            password: form.values.password,
                            callbackUrl: `${window.location.origin}/dashboard/nurse/`,
                        });
                        if (res?.error) {
                            setError(res.error);
                        } else {
                            setError(null);
                        }
                        if (res.url) {
                            await router.push(res.url);
                        }
                    }}>
                        <TextInput
                            required
                            label="Email"
                            placeholder="your@email.com"
                            {...form.getInputProps('email')}
                            size={"xl"}
                        />
                        <Space h={"xl"}/>
                        <PasswordInput
                            required
                            label="Mot de passe"
                            placeholder="********"
                            visibilityToggleIcon={({reveal, size}) =>
                                reveal ? <AiOutlineEyeInvisible size={size}/> : <AiOutlineEye size={size}/>
                            }
                            {...form.getInputProps('password')}
                            size={"xl"}
                        />
                        <Space h={"xl"}/>
                        <Button type="submit" size={"xl"}
                                style={{backgroundColor: '#4ad4c6', float: 'right'}}>Me connecter</Button>
                    </form>
                </Grid.Col>
            </Grid>
        </>
    )
}

export async function getServerSideProps(context) {
    return {
        props: {
            csrfToken: await getCsrfToken(context),
        },
    };
}

