import React from 'react'

export default function Form() {
    const [Valu, setFormValues] = useState({
    });
    
    const submitForm = event => {
        event.preventDefault();
        const newUser = {
            name: Valu.myName.trim(),
            email: Valu.myEmail.trim(),
            password: Valu.myPassword.trim()
        }
        
        setFormValues(initialFormValues)
        console.log('Submitted');
    };

    const onChanges = event => {
        console.log('Changed', event.target.value);
        const {name, value} = event.target
        setFormValues({...Valu, [name]: value,
        });
    };

    return (
        <form onSubmit={submitForm}>
            <label>Name: 
                <input 
                    name='myName'
                    type='text'
                    onChange={onChanges}
                    value={Valu.myName}
                    
                />
            </label>
            <label>Email:
                <input 
                    type='text'
                    name='myEmail'
                    onChange={onChanges}
                    value={Valu.myEmail}
                    
                />
            </label>
            <label>Password:
                <input 
                    type='text'
                    name='myPassword'
                    onChange={onChanges}
                    value={Valu.myPassword}
                    
                />
            </label>
            <label> Confirm password:
            <input
            type='text'
            name='myPassword'
            onChange={onChanges}
            value={Valu.myPassword}
            />
            </label>
            <label>SubmitBtn

</label>
</form>
)
} 