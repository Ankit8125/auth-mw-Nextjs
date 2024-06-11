'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { initialSignUpFormData, userRegistrationFormControls } from "../utils"
import { useState } from "react"
import CommonFormElement from "@/components/form-element/page"
import { Button } from "@/components/ui/button"
import { registerUserAction } from "@/actions"
import { useRouter } from "next/navigation"

// it is client component because we need to manage some state

function SignUp(){

    const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData)
    // console.log(setSignUpFormData);
    
    // doing client side validation
    function handleSignUpBtnValid(){
        return Object.keys(signUpFormData).every((key) => signUpFormData[key].trim() !== '')
    }

    const router = useRouter() // once user signed up, then we have to redirect him to sign in page

    async function handleSignUp(){
        const result = await registerUserAction(signUpFormData)
        console.log(result);

        if(result?.data){ // this data we are getting from 'actions' of savedUser => data: JSON.parse(JSON.stringify(savedUser))
            router.push('/sign-in')
        }
    }

    return (
        <div>
            <h1>Registration</h1>
            <form action={handleSignUp}>
                {
                    userRegistrationFormControls.map((controlItem) => (
                    <div key={controlItem.name}>
                        <Label>{controlItem.label}</Label>
                        <CommonFormElement 
                        value={signUpFormData[controlItem.name]} 
                        currentItem={controlItem}
                        onChange={(event) => setSignUpFormData({
                            ...signUpFormData,
                            [event.target.name]: event.target.value // we need to dynamically update all 3 fields. So for username it will be username, for email it will be email and for pwd it will be pwd
                        })}
                        />
                    </div>)
                )}
                <Button disabled={!handleSignUpBtnValid()} classname="disabled:opacity-65" type='submit'>
                    Sign Up
                </Button>
            </form>
        </div>
    )
}

export default SignUp