import React, { useState, useEffect, Suspense  } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';

import { __ } from "@wordpress/i18n";
import apiFetch from "@wordpress/api-fetch";

import { Layout, Typography, Banner, Space, Badge, Button, SideSheet, Col, Row,  } from '@douyinfe/semi-ui';
import { IconStar, IconSetting, IconHome, IconMember, IconBookStroked, IconHelpCircleStroked, IconBellStroked, IconSun, IconMoon, IconTemplate,IconCustomerSupport, IconFile, } from '@douyinfe/semi-icons';
import { LocaleProvider } from '@douyinfe/semi-ui';
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";

import { Dashboard, About, Contact, Settings, ImportExport, More, Tools, Logs, LogsCharts, LogsTable, Feedback, FreeVsPro, NotFound} from './pages';

import {
    BasicInputs, 
    ArrayInputs,
    BoxedLeftSidebar,
    BoxedNoSidebar,
    BoxedRightSidebar,
    FullWidthLeftSidebar,
    FullWidthNoSidebar,
    FullWidthRightSidebar,
} from './pages';
import Page from './pages/Page';

import {HorizontalMenuControl} from "./components";
import { Logo } from './lib/Illustrations';
import Details from './data/details.json';

import './App.scss';
import "./tailwind.css";
const year = new Date().getFullYear();
const { Header, } = Layout;
function App() {
    const { Header, Footer } = Layout;
    const { Text } = Typography;
    const [newsVisible, setNewsVisible] = useState(false);
    const [darkmode, setDarkmode] = useState(false);
    useEffect(() => {
        const fetchSettingTheme = async () => {
            try {
                const params = new URLSearchParams({
                    id: mos_product_specifications_tab_ajax_obj.get_current_user_id,
                });
                const theme = await apiFetch({
                    path: `/mos-product-specifications-tab/v1/get-settings-theme?${params.toString()}`,
                    method: 'GET'
                });      

                // console.log('Theme received:', theme);
                document.body.setAttribute('theme-mode', theme);

                const isDark = theme === 'dark' || theme.value === 'dark';
                setDarkmode(isDark);
            } catch (err) {
                console.error('API error:', err);
            }
        };

        fetchSettingTheme();
    }, []); 
    const switchingMode = async () => {
        const switchMode = !darkmode;
        setDarkmode(switchMode);
        try {
            const params = new URLSearchParams({
                id: mos_product_specifications_tab_ajax_obj.get_current_user_id,
                settings_theme: switchMode ? 'dark' : 'light',
            });

            const response = await apiFetch({
                path: `/mos-product-specifications-tab/v1/set-settings-theme?${params.toString()}`,
                // method: 'GET'
            });
            if (response.success) {
                document.body.setAttribute('theme-mode', switchMode?'dark':'light');
            }
            console.log(response);
        } catch (error) {
            console.error("Error fetching settings data:", error);
        }
    };

    const HorizontalMenuItems = [
        { itemKey: 'dashboard', text: 'Dashboard', icon: <IconHome />, url: '/' },
        { 
            itemKey: 'layouts', 
            text: 'Layouts', 
            icon: <IconTemplate />,
            url: '/layouts',
            items: [
                { itemKey: 'about', text: 'About', url: '/about' },
                { itemKey: 'contact', text: 'Contact', url: '/contact' },
                { 
                    itemKey: 'layouts-boxed', 
                    text: 'Boxed Layouts', 
                    url: '/layouts/boxed',
                    items: [
                        { itemKey: 'layouts-boxed-nosidebar', text: 'No Sidebar', url: '/layouts/boxed/nosidebar' },
                        { itemKey: 'layouts-boxed-left-sidebar', text: 'Left Sidebar', url: '/layouts/boxed/left-sidebar' },
                        { itemKey: 'layouts-boxed-right-sidebar', text: 'Right Sidebar', url: '/layouts/boxed/right-sidebar' },
                    ] 
                },
                { 
                    itemKey: 'layouts-full', 
                    text: 'Full Layouts', 
                    url: '/layouts/full',
                    items: [
                        { itemKey: 'layouts-full-nosidebar', text: 'No Sidebar', url: '/layouts/full/nosidebar' },
                        { itemKey: 'layouts-full-left-sidebar', text: 'Left Sidebar', url: '/layouts/full/left-sidebar' },
                        { itemKey: 'layouts-full-right-sidebar', text: 'Right Sidebar', url: '/layouts/full/right-sidebar' },
                    ] 
                },
            ] 
        },
        { itemKey: 'settings', text: 'Settings', icon: <IconSetting />, url: '/settings' },
        { itemKey: 'feedback', text: 'Feedback', icon: <IconStar />, url: '/feedback' },

        ...(!mos_product_specifications_tab_ajax_obj?.isPro
            ? [
                {
                    itemKey: 'free-vs-pro',
                    text: 'Free vs Pro',
                    icon: <IconMember />,
                    url: '/free-vs-pro'
                }
            ]
            : []
        ),
        // { itemKey: 'free-vs-pro', text: 'Free vs Pro', icon: <IconMember />, url: '/semi/free-vs-pro' },
    ];
    return (
        <LocaleProvider locale={en_US}>
            <div className="mos-product-specifications-tab-settings-container semi-scope" style={{backgroundColor: 'var(--semi-color-bg-1)'}}>
                {!mos_product_specifications_tab_ajax_obj?.isPro &&
                    <Banner 
                        className="mos-product-specifications-tab-promote-banner"
                        fullMode={false}
                        type="info"
                        description={
                            <>
                                <Text>{__('You\'re currently using the Free plan. ', 'mos-product-specifications-tab')}</Text>
                                <Text>{__('Some settings and features are only available in ', 'mos-product-specifications-tab')}</Text>
                                <b><Text link={{ href: 'https://semi.design', target: '_blank' }}>{__('Pro version.', 'mos-product-specifications-tab')}</Text></b>
                            </>
                        }
                    />
                }
                <Header
                    style={{backgroundColor:'var(--semi-color-bg-3)'}}
                    className="mos-product-specifications-tab-header"
                >                    
                    <HorizontalMenuControl
                        items = {HorizontalMenuItems}
                        breakpoint = "960"
                        headerContent = {{
                            logo: <Logo width={36} height={36} />,
                            text: Details?.name,
                        }}
                        footerContent = {(
                            <Space className="header-menu-footer-content" align='center'>  
                                {/* <Badge count={Details?.version} theme='light' countStyle={{padding: 8, height: 'auto'}} />     */}
                                <Button theme='outline' icon={darkmode?<IconSun />:<IconMoon />} aria-label="Mode" onClick={switchingMode} />
                                {/* <a
									href="https://wordpress.org/support/plugin/mos-product-specifications-tab/"
									target="_blank"
									rel="noreferrer noopener"
									aria-label={ __(
										'Get support (opens in new tab)',
										'mos-product-specifications-tab'
									) }
								>
									<IconCustomerSupport/>
								</a>
								<a
									href="https://wordpress.org/support/plugin/mos-product-specifications-tab/reviews/?filter=5#new-post"
									target="_blank"
									rel="noreferrer noopener"
									aria-label={ __(
										'Leave a review (opens in new tab)',
										'mos-product-specifications-tab'
									) }
								>
									<IconStar/>
								</a> */}

                                <Button 
                                    theme='outline' 
                                    icon={<IconFile />} 
                                    aria-label={__("Documentation", 'mos-product-specifications-tab')}
                                    onClick={ () =>
                                        window.open(
                                            'https://wordpress.org/support/plugin/mos-product-specifications-tab/',
                                            '_blank'
                                        )
                                    }
                                />
                                <Button 
                                    theme='outline' 
                                    icon={<IconStar />} 
                                    aria-label={__("Help Center", 'mos-product-specifications-tab')} 

                                    onClick={ () =>
                                        window.open(
                                            'https://wordpress.org/support/plugin/mos-product-specifications-tab/reviews/?filter=5#new-post',
                                            '_blank'
                                        )
                                    }
                                />

                                <Badge count={5}>
                                    <Button theme='outline' icon={<IconBellStroked />} onClick={() => setNewsVisible(true)} aria-label="Screenshot" />
                                </Badge>
                            </Space>
                        )}
                    />
                </Header>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />

                    <Route path="/layouts">
                        <Route index element={<Navigate to="boxed/nosidebar" replace />} />
                        <Route path="boxed/nosidebar" element={<BoxedNoSidebar />} />
                        <Route path="boxed/left-sidebar" element={<BoxedLeftSidebar />} />
                        <Route path="boxed/right-sidebar" element={<BoxedRightSidebar />} />
                        <Route path="full/nosidebar" element={<FullWidthNoSidebar />} />
                        <Route path="full/left-sidebar" element={<FullWidthLeftSidebar />} />
                        <Route path="full/right-sidebar" element={<FullWidthRightSidebar />} />
                    </Route>
                    
                    <Route path="/settings" element={<Settings />}>
                        <Route index element={<Navigate to="basic-inputs" replace />} />
                        <Route path="basic-inputs" element={<BasicInputs />} />
                        <Route path="array-inputs" element={<ArrayInputs />} />
                        <Route path="page/page-1" element={<Page />} />
                        <Route path="page/page-2" element={<Page />} />
                        
                        {/* Other menu items */}
                        <Route path="import-export" element={<ImportExport />} />
                        <Route path="more" element={<More />} />
                        {/* <Route path="logs" element={<Logs />} /> */}
                        <Route path="logs" element={<Navigate to="table" replace />} />
                        <Route path="logs/table" element={<LogsTable />} />
                        <Route path="logs/analytics" element={<LogsCharts />} />
                        <Route path="tools" element={<Tools />} />
                    </Route>
                    <Route path="feedback" element={<Feedback />} />
                    <Route path="free-vs-pro" element={<FreeVsPro />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer
                    className="p-[15px] w-full mos-product-specifications-tab-footer" 
                    style={{borderTop: '1px solid var(--semi-color-border)', backgroundColor:'var(--semi-color-bg-2)'}}
                >
                    <Row type="flex" gutter={24} align="middle" justify="space-between">
                        <Col xs={24} lg={12} className="text-center lg:text-left mb-2 lg:mb-0">
                            <Text>{__(`Copyright © ${year} `, 'mos-product-specifications-tab')}</Text>
                            <Text link={{ href: Details?.authorURI, target: '_blank' }}>{Details?.author}. </Text>
                            <Text>{__(`All Rights Reserved.`, 'mos-product-specifications-tab')}</Text>
                            {/* <Space align='center' spacing='medium'>
                                <img src={`${mos_product_specifications_tab_ajax_obj.image_url}logo.svg`} alt="" width="30" height="30" />
                                <Text>{Details?.name}</Text>
                            </Space> */}
                        </Col>
                        <Col xs={24} lg={12} className="text-center lg:text-right">
                            <Space align='center' spacing='medium'>
                                {mos_product_specifications_tab_ajax_obj?.isPro === '1'?
                                    <>
                                        <Badge count={__( 'Pro', "mos-product-specifications-tab" )} theme='light' style={{padding: 8, height: 'auto'}} />
                                        <Badge count={mos_product_specifications_tab_ajax_obj?.proVersion} theme='light' style={{padding: 8, height: 'auto'}} />
                                    </>
                                    :
                                    <>                                    
                                        <Badge count={__( 'Free', "mos-product-specifications-tab" )} theme='light' style={{padding: 8, height: 'auto'}} />
                                        <Badge count={Details?.version} theme='light' style={{padding: 8, height: 'auto'}} />
                                    </>
                                }
                                
                            </Space>
                        </Col>
                    </Row>
                </Footer>
                
    
                {/* --- What's New SideSheet --- */}
                <SideSheet
                    placement="right"
                    visible={newsVisible}
                    onCancel={() => setNewsVisible(false)}
                    title={__("What's New?", "mos-product-specifications-tab")}
                    closeOnEsc={true}
                >
                    <p>Feature updates and news content go here...</p>
                </SideSheet>
            </div>
        </LocaleProvider>
    );
}

export default App;