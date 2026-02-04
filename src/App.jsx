import React, { useState, useEffect, Suspense  } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';

import { __ } from "@wordpress/i18n";
import apiFetch from "@wordpress/api-fetch";

import { Layout, Typography, Banner, Space, Badge, Button, SideSheet, Col, Row, Tag, Modal, } from '@douyinfe/semi-ui';
import { IconStar, IconSetting, IconHome, IconMember, IconBookStroked, IconHelpCircleStroked, IconBellStroked, IconSun, IconMoon, IconTemplate,IconCustomerSupport, IconFile, } from '@douyinfe/semi-icons';
import { LocaleProvider } from '@douyinfe/semi-ui';
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";

import { Dashboard, General, Settings, ImportExport, More, Tools, Logs, LogsCharts, LogsTable, Feedback, FreeVsPro, NotFound} from './pages';


import {HorizontalMenuControl} from "./components";
import { Logo } from './lib/Illustrations';
import Details from './data/details.json';

import './App.scss';
import "./tailwind.css";
const year = new Date().getFullYear();
const { Header, Footer } = Layout;
const { Text, Paragraph } = Typography;
function App() {
    const [darkmode, setDarkmode] = useState(false);
    
    const [newsVisible, setNewsVisible] = useState(false);
    const [newsItems, setNewsItems] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [activeNews, setActiveNews] = useState(null);
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

    const truncateText = (text, wordLimit = 15) => {
        const words = text.split(/\s+/);
        if (words.length <= wordLimit) return text;
        return words.slice(0, wordLimit).join(' ') + '...';
    };
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('https://raw.githubusercontent.com/mostak-shahid/update/refs/heads/master/plugin-news.json');
                const data = await response.json();
                setNewsItems(data);
            } catch (error) {
                console.error("Error fetching news:", error);
            }
        };
        fetchNews();
    }, []); 

    const handleNewsVisible = (visible) => {
        setNewsVisible(visible);
        // if (visible && newsItems.length === 0) {
        //     fetchNews();
        // }
    };

    const HorizontalMenuItems = [
        { itemKey: 'dashboard', text: 'Dashboard', icon: <IconHome />, url: '/' },
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
                                <Badge count={newsItems.length || 0}>
                                    <Button theme='outline' icon={<IconBellStroked />} onClick={() => handleNewsVisible(true)} aria-label="Screenshot" />
                                </Badge>
                            </Space>
                        )}
                    />
                </Header>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    
                    <Route path="/settings" element={<Settings />}>
                        <Route index element={<Navigate to="general" replace />} />
                        <Route path="general" element={<General />} />
                        
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
                    onCancel={() => handleNewsVisible(false)}
                    title={__("What's New?", "plugin-starter")}
                    closeOnEsc={true}
                >
                    {newsItems.length === 0 ? (
                        <p>{__("Loading news...", "plugin-starter")}</p>
                    ) : (
                        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            {newsItems.map((item) => (
                                <div key={item.id} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--semi-color-border)' }}>
                                    <Text strong style={{ fontSize: '16px' }}>{item.title}</Text>
                                    {item?.tags && item.tags.length > 0 && (
                                        <div className='mt-2'>
                                            <Space>
                                                {item.tags.map((tag, index) => (
                                                    <Tag key={index} size="small" shape='circle' color='amber'>{tag}</Tag>
                                                ))}
                                            </Space>
                                        </div>
                                    )}
                                    <div className='mt-2'>
                                        <Paragraph type="secondary">
                                            {truncateText(item.news)}
                                        </Paragraph>
                                        <Button
                                            type="link"
                                            size="small"

                                            onClick={() => {
                                                setActiveNews(item);
                                                setModalVisible(true);
                                            }}
                                            // onClick={() => alert(item.news)}
                                            // style={{ padding: 0, marginLeft: '5px' }}
                                        >
                                            {__("Read more", "plugin-starter")}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </SideSheet>
            </div>
            <Modal
                title={activeNews?.title}
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                style={{ maxWidth: 700 }}
            >
                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                    {activeNews?.tags?.length > 0 && (
                        <Space style={{ marginBottom: 12 }}>
                            {activeNews.tags.map((tag, index) => (
                                <Tag key={index} size="small" shape="circle" color="amber">
                                    {tag}
                                </Tag>
                            ))}
                        </Space>
                    )}

                    <Paragraph>
                        {activeNews?.news}
                    </Paragraph>
                </div>
            </Modal>
        </LocaleProvider>
    );
}

export default App;