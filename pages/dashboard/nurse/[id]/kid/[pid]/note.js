import {privateRoute} from "../../../../../../components/privateRoute";
import {useState} from 'react';
import RichTextEditor from '../../../../../../components/rte';
import {Button, Space} from "@mantine/core";


function Note({auth}) {
    const [value, onChange] = useState('');
    return (
        <>
            <form>
                <RichTextEditor
                    placeholder="Résumer en quelques phrases la journée d'un enfant"
                    value={value}
                    onChange={onChange}/>
                <Space h={"xl"}/>
                <Button type="submit" size={"lg"}
                        style={{backgroundColor: '#4ad4c6', float: 'right'}}>Enregistrer</Button>
            </form>

        </>
    );
}

export default privateRoute(Note);