import { IListItem } from './content.interfaces';

export const lists: IListItem[] = [
    {
        header: 'Common cases',
        id: 1,
        defaultSvg: 'common-cases',
        activeSvg: 'common-cases-active',
        text: [
            {
                content: 'Date',
                id: 1,
                scrollTo: 'prefix',
            },
            {
                content: 'Date and hour',
                id: 2,
                scrollTo: 'date',
            },
            {
                content: 'Hour',
                id: 3,
                scrollTo: 'hour',
            },
            {
                content: 'Valid 24 hour format',
                id: 4,
                scrollTo: 'valid24',
            },
            {
                content: 'Mixed types',
                id: 5,
                scrollTo: 'mixed',
            },
            {
                content: 'Valid date and month',
                id: 6,
                scrollTo: 'validdate',
            },
        ],
    },
    {
        header: 'Options',
        id: 2,
        defaultSvg: 'options',
        activeSvg: 'options-active',
        text: [
            {
                content: 'Prefix',
                id: 1,
                scrollTo: 'prefix',
            },
            {
                content: 'Suffix',
                id: 2,
                scrollTo: 'suffix',
            },
            {
                content: 'dropSpecialCharacters',
                id: 3,
                scrollTo: 'special-ch',
            },
            {
                content: 'showMaskTyped',
                id: 4,
                scrollTo: 'show-mask',
            },
            {
                content: 'clearIfNotMatch',
                id: 5,
                scrollTo: 'clear',
            },
            {
                content: 'Validation',
                id: 6,
                scrollTo: 'valid',
            },
        ],
    },
    {
        header: 'Separators',
        id: 3,
        defaultSvg: 'separator',
        activeSvg: 'separator-active',
        text: [
            {
                content: 'Separator',
                id: 1,
                scrollTo: 'sep',
            },
            {
                content: 'Dot separator',
                id: 2,
                scrollTo: 'Dsep',
            },
            {
                content: 'Comma separator',
                id: 3,
                scrollTo: 'comma_sep',
            },
        ],
    },
    {
        header: 'Other',
        id: 4,
        defaultSvg: 'other',
        activeSvg: 'other-active',
        text: [
            {
                content: 'Secure input',
                id: 1,
            },
            {
                content: 'Pipe',
                id: 2,
            },
            {
                content: 'specialCharacters',
                id: 3,
            },
        ],
    },
];
