import { IListItem } from '@open-source/accordion/content.interfaces';

export const lists: IListItem[] = [
    {
        header: 'Common cases',
        id: 1,
        defaultSvg: 'common-cases',
        activeSvg: 'common-cases-active',
        whiteChevron: 'white-chevron-down',
        yellowChevron: 'yellow-chevron-down',
        text: [
            {
                content: 'Date',
                id: 1,
                scrollTo: 'date',
            },
            {
                content: 'Date and hour',
                id: 2,
                scrollTo: 'date-and-hour',
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
                content: 'Valid date start with years',
                id: 9,
                scrollTo: 'startWithYears',
            },
            {
                content: 'SpecialCharacters Mask',
                id: 7,
                scrollTo: 'mask-specialCharacters',
            },
            {
                content: 'Optional mask',
                id: 12,
                scrollTo: 'optional-mask',
            },
            {
                content: 'allowNegativeNumber',
                id: 11,
                scrollTo: 'allowMask',
            },
            {
                content: 'Allow few mask in one expression',
                id: 8,
                scrollTo: 'allow-few-mask',
            },
        ],
    },
    {
        header: 'Options',
        id: 2,
        defaultSvg: 'options',
        activeSvg: 'options-active',
        whiteChevron: 'white-chevron-down',
        yellowChevron: 'yellow-chevron-down',
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
        whiteChevron: 'white-chevron-down',
        yellowChevron: 'yellow-chevron-down',
        text: [
            {
                content: 'Separator',
                id: 1,
                scrollTo: 'sep',
            },
            {
                content: 'Separator',
                id: 4,
                scrollTo: 'lead-zero',
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
        whiteChevron: 'white-chevron-down',
        yellowChevron: 'yellow-chevron-down',
        text: [
            {
                content: 'Secure input',
                id: 1,
                scrollTo: 'secure',
            },
            {
                content: 'Pipe',
                id: 2,
                scrollTo: 'pipe',
            },
            {
                content: 'specialCharacters',
                id: 3,
                scrollTo: 'special',
            },
        ],
    },
];
