import React from 'react';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { Icon, IIconProps } from '@fluentui/react/lib/Icon';

import { IPersonaSharedProps, ISearchBoxProps, Persona, PersonaPresence, PersonaSize, SearchBox, Stack } from '@fluentui/react';
import { NavBarStackProps } from './NavBar.styles';

const IconProps: IIconProps = {
    styles: {
        root: {
            fontSize: '20px',
            width: '20px'
        }
    }
}

const SearchProps: ISearchBoxProps = {
    placeholder: 'Search',
    
    styles: {
        root: {
            width: '900px'
        }
    }
}

const PersonaProps: IPersonaSharedProps = {
    imageInitials: 'P',
}

export const NavBar: React.FunctionComponent = () => {
    initializeIcons();
    return(
        <Stack horizontal {...NavBarStackProps}>
            <Stack horizontal tokens={{childrenGap: '10px'}}>
                <Stack><Icon iconName={'WaffleOffice365'} {...IconProps} /></Stack>
                <Stack>Microsoft Teams </Stack>
            </Stack>
            <Stack>
              <SearchBox {...SearchProps } onSearch={newValue => console.log('value is ' + newValue)} />
            </Stack>
            <Stack horizontal tokens={{childrenGap: '10px'}}>
                <Icon iconName={'more'} {...IconProps} />
                <Persona
                    {...PersonaProps}
                    size={PersonaSize.size32}
                    presence={PersonaPresence.online}
                    imageAlt="Palak, status is online"
                />
            </Stack>
        </Stack>
    )
}