import { IStackProps } from "@fluentui/react";

export const signUpStackChildrenProps: IStackProps = {
    tokens: {
        padding: '10px'
    },
    verticalAlign: 'center',
    horizontalAlign: 'center',
    styles: {
        root: {
            background: 'white',
            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', 
            height: '300px',
            width: '300px',
        }
    }
}

export const signUpStackProps: IStackProps = {
    tokens: {
    },
    verticalAlign: 'center',
    horizontalAlign: 'center',
    styles: {
        root: {
            background: '#E5EAFA',
            height: '100vh',
            // border: 'solid black 1px',
            
        }
    }
}

