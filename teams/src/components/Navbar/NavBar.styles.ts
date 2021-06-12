import { IStackProps } from '@fluentui/react';

export const NavBarStackProps: IStackProps = {
    tokens: {
        padding: '10px',
    },
    verticalAlign: 'center',
    horizontalAlign: 'space-between',
    styles: {
        root: {
            background: '#464775',
            height: '50px',
            color: 'white',
            fontFamily: '"Segoe UI",system-ui,"Apple Color Emoji","Segoe UI Emoji",sans-serif',
            fontSize: '14px'
        }
    }
}