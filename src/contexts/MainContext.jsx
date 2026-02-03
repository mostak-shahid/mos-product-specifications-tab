import { __ } from '@wordpress/i18n';
// import apiFetch from "@wordpress/api-fetch";
import { createContext, useContext, useState } from "react";

import {IconSetting,IconLikeThumb,IconCloud,IconPlusCircle,IconUser,} from '@douyinfe/semi-icons';

const MainContext = createContext();
const settingsMenu = [
    {
        itemKey: "page",
        text: __("Page", "mos-product-specifications-tab"),
        description: __("Page", "mos-product-specifications-tab"),
        url: "/settings/page",
        icon: <IconUser />,
        items: [
            {
                itemKey: "page-1",
                text: __("Page 1", "mos-product-specifications-tab"),
                description: __("Page 1", "mos-product-specifications-tab"),
                url: "/settings/page/page-1",
            },
            {
                itemKey: "page-2",
                text: __("Page 2", "mos-product-specifications-tab"),
                description: __("Page 2", "mos-product-specifications-tab"),
                url: "/settings/page/page-2",
            },
        ],
    },

    {
        itemKey: "import_export",
        text: __("Import & Expport", "mos-product-specifications-tab"),
        description: __("Import and Export your settings.", "mos-product-specifications-tab"),
        url: "/settings/import_export",
        icon: <IconCloud />,
    },

    {
        itemKey: "more",
        text: __("More", "mos-product-specifications-tab"),
        description: __("Adding more features to your Store.", "mos-product-specifications-tab"),
        url: "/settings/more",
        icon: <IconPlusCircle />,
    },

    {
        itemKey: "tools",
        text: __("Tools", "mos-product-specifications-tab"),
        description: __("Adding more features to your Store.", "mos-product-specifications-tab"),
        url: "/settings/tools",
        icon: <IconSetting />,
    },

    {
        itemKey: "feedback",
        text: __("Feedback", "mos-product-specifications-tab"),
        description: __(
        "We're constantly enhancing our product, and your feedback is key to staying ahead of the curve and delivering a stronger, more reliable security solution for you.",
        "mos-product-specifications-tab"
        ),
        url: "/feedback",
        icon: <IconLikeThumb />,
    },
];


export const MainProvider = ({ children }) => {
    const [settingData, setSettingData] = useState({});
    const [settingLoading, setSettingLoading] = useState(true);
    const [settingReload, setSettingReload] = useState(true);
    return (
        <MainContext.Provider
            value={{
                settingData, 
                setSettingData,
                settingLoading,
                setSettingLoading,
                settingsMenu,
                settingReload, 
                setSettingReload
            }}
        >
            {children}
            {/* {console.log('settingData from contex API', settingData)} */}
        </MainContext.Provider>
    );
};

export const useMain = () => useContext(MainContext);
