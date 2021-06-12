import { Stack } from '@fluentui/react';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import React from 'react';
import { signUpStackChildrenProps, signUpStackProps } from './SignUp.styles';


export const SignUp: React.FunctionComponent = () => {
    return(
        <Stack {...signUpStackProps}>
            <Stack {...signUpStackChildrenProps}>
                <PrimaryButton ariaDescription="Detailed description used for screen reader." >
                    Sign up using Google
                </PrimaryButton>
                <br></br>
                <h5>Already have an account? Sign in here</h5>

            </Stack>  
        </Stack>
    )
} 
