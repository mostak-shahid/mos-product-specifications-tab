import { __ } from "@wordpress/i18n";
import apiFetch from '@wordpress/api-fetch';
import { useEffect, useState } from 'react';
import {PluginCard} from "../../components";
import Details from '../../data/details.json';
import './Dashboard.scss';
import {FullWidthLayout} from '../../layouts';
// import {
//     Card,
//     CardHeader,
//     CardBody,
// } from '@wordpress/components';
import { Typography, Card, Col, Row  } from '@douyinfe/semi-ui';
export default function Dashboard() {
    const { Text, Paragraph, Title } = Typography;
    const [plugins, setPlugins] = useState([]);
    const [pluginsLoading, setPluginsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchPlugins = async () => {
        try {
            // const response = await apiFetch({ path: 'https://raw.githubusercontent.com/mostak-shahid/update/refs/heads/master/plugin-details.json' });
            const response = await apiFetch({ path: `/mos-product-specifications-tab/v1/plugins` });
            // 
            setPlugins(response.plugins);
        } catch (error) {
            setError('Error fetching plugin data:', error);
        } finally {
            setPluginsLoading(false);
        }
        };
        fetchPlugins();
    }, []);
    
    return (
        <FullWidthLayout>
            <div className="">
                <Card
                    className="mb-6"
                >
                    <Title heading={2}>{__(`Welcome to ${Details?.name}`, "mos-product-specifications-tab")}</Title>
                    <Paragraph>
                        {__("You can add an infinite number of specs to any or all of your products using the Product specifications tab for WooCommerce plugin. You can add any kind of information to the product using the WYSIWYG editor available to each group. The options are unlimited.", "mos-product-specifications-tab")}
                    </Paragraph>
                    <Paragraph>
                        {__("When selling products online, it’s important to provide customers with full product details to help them make informed purchase decisions. WooCommerce product specifications are an excellent way to display details in an orderly manner. They give give shoppers all the product insights quickly and with less clutter.", "mos-product-specifications-tab")}
                    </Paragraph>
                </Card>
                <Row type="flex" gutter={[24,24]}>
                    <Col lg={16}>
                        <Card 
                            title={__("Features", "mos-product-specifications-tab")}
                            className="dashboard-features-card mb-6"
                        >
                            <Row type="flex" gutter={[24,24]}>
                                <Col lg={8}>
                                    <Card style={{height: '100%'}}>
                                        <Title heading={4}>{__("Easy Product Specification Tables", "mos-product-specifications-tab")}</Title>
                                        <Paragraph>
                                            {__("Quickly build clear product specification tables with an intuitive interface, requiring no coding knowledge, saving time during product setup process.", "mos-product-specifications-tab")}
                                        </Paragraph>
                                    </Card>
                                </Col>
                                <Col lg={8}>
                                    <Card style={{height: '100%'}}>
                                        <Title heading={4}>{__("Multiple Tables per Product", "mos-product-specifications-tab")}</Title>
                                        <Paragraph>
                                            {__("Add and manage multiple specification tables per product, perfect for variants, bundles, or complex products with diverse technical details requirements.", "mos-product-specifications-tab")}
                                        </Paragraph>
                                    </Card>
                                </Col>
                                <Col lg={8}>
                                    <Card style={{height: '100%'}}>
                                        <Title heading={4}>{__("Group and Spec Sorting", "mos-product-specifications-tab")}</Title>
                                        <Paragraph>
                                            {__("Create, reorder, and sort specification groups and individual fields easily, ensuring information appears logically and improves customer readability and comprehension.", "mos-product-specifications-tab")}
                                        </Paragraph>
                                    </Card>
                                </Col>
                                <Col lg={8}>
                                    <Card style={{height: '100%'}}>
                                        <Title heading={4}>{__("Hide Specification Tab", "mos-product-specifications-tab")}</Title>
                                        <Paragraph>
                                            {__("Disable the product specification tab whenever needed, keeping product pages clean when specifications are unnecessary or temporarily unavailable for customers.", "mos-product-specifications-tab")}
                                        </Paragraph>
                                    </Card>
                                </Col>
                                <Col lg={8}>
                                    <Card style={{height: '100%'}}>
                                        <Title heading={4}>{__("Shortcode Support (Upcoming)", "mos-product-specifications-tab")}</Title>
                                        <Paragraph>
                                            {__("Use a flexible shortcode to place specification tables anywhere, enabling custom layouts, landing pages, and dynamic content placement options soon.", "mos-product-specifications-tab")}
                                        </Paragraph>
                                    </Card>
                                </Col>
                                <Col lg={8}>
                                    <Card style={{height: '100%'}}>
                                        <Title heading={4}>{__("Fully Customizable", "mos-product-specifications-tab")}</Title>
                                        <Paragraph>
                                            {__("Customize the appearance and behavior of specification tables to match your brand and design preferences.", "mos-product-specifications-tab")}
                                        </Paragraph>
                                    </Card>
                                </Col>
                            </Row>
                            {/* {Object.values(settingsMenu).map((feature, index) => (
                                <div className="feature" key={index}>
                                    <Title heading={4}>{feature?.title}</Title>
                                    <Paragraph>{feature?.description}</Paragraph>
                                </div>
                            ))} */}
                            {/* {settingsMenu.map((feature) => (
                                <div className="feature" key={feature.itemKey}>
                                    <Title heading={4}>{feature.text}</Title>
                                    {feature.description && (
                                        <Paragraph>{feature.description}</Paragraph>
                                    )}
                                </div>
                            ))} */}
                        </Card>
                        <Card 
                            title={__("Extend Your Website", "mos-product-specifications-tab")}
                            className=""
                        >
                            <Row type="flex" gutter={[16, 16]}>
                                {
                                    pluginsLoading 
                                    ? 
                                    <div>                                    
                                        loading...
                                    </div>
                                    : <>
                                    {/* {Object.entries(plugins).map(([slug, plugin]) => ( 
                                        <div className="col-lg-6">
                                            <PluginCard 
                                                key={slug} 
                                                image={plugin.image} 
                                                name={plugin.name} 
                                                intro={plugin.intro} 
                                                plugin_source={plugin.source} 
                                                plugin_slug={slug} 
                                                plugin_file={plugin.file} 
                                                download_url={plugin.download}
                                            /> 
                                        </div> 
                                        ))
                                    } */}
                                    {plugins.map((plugin, index) => ( 
                                        plugin?.slug !== 'mos-product-specifications-tab' && 

                                            <Col lg={12} key={index}>
                                                {/* {console.log(plugin)} */}
                                                <PluginCard 
                                                    key={plugin.slug} 
                                                    image={plugin.icons['1x']} 
                                                    name={plugin.name} 
                                                    intro={plugin.short_description} 
                                                    author={plugin.author}
                                                    plugin_source='internal'
                                                    plugin_slug={plugin.slug} 
                                                    plugin_file={`${plugin.file}/${plugin.slug}`} 
                                                    download_url={plugin.download_link}
                                                    version={plugin.version}
                                                    rating={plugin.rating}
                                                    num_ratings={plugin.num_ratings}
                                                    active_installs={plugin.active_installs}
                                                    tested={plugin.tested}
                                                /> 
                                            </Col> 
                                        
                                        ))
                                    }
                                    </>
                                }
                            </Row>
                        </Card>
                    </Col>
                    <Col lg={8}>
                        <Card 
                            className="mb-6"
                            title={__("VIP Priority Support", "mos-product-specifications-tab")}
                        >
                            <Paragraph>
                                {__("Faster and exclusive support service designed for VIP assistance and benefits.", "mos-product-specifications-tab")}                                    
                            </Paragraph>
                            <Text link={{ href: 'https://semi.design/', target:"_blank" }}>{__("Support", "mos-product-specifications-tab")}</Text>
                        </Card>

                        <Card 
                            className="mb-6"
                            title={__("Help Center", "mos-product-specifications-tab")}
                        >
                            <Paragraph>
                                {__("Faster and exclusive support service designed for VIP assistance and benefits.", "mos-product-specifications-tab")}                                    
                            </Paragraph>
                            <Text link={{ href: 'https://semi.design/', target:"_blank" }}>{__("Help", "mos-product-specifications-tab")}</Text>
                        </Card>
                        
                        <Card 
                            className="mb-6"
                            title={__("Join the Community", "mos-product-specifications-tab")}  
                        >                   
                            <Paragraph>
                                {__("Got a question about the plugin, want to share your awesome project or just say hi? Join our wonderful community!", "mos-product-specifications-tab")}                                    
                            </Paragraph>
                            <Text link={{ href: 'https://semi.design/', target:"_blank" }}>
                                {__("Join", "mos-product-specifications-tab")}
                            </Text>                            
                        </Card>
                        <Card
                            title={__("Rate Us", "mos-product-specifications-tab")} 
                        >
                            <Paragraph>
                                {__("We love to hear from you, we would appreciate every single review.", "mos-product-specifications-tab")}                                    
                            </Paragraph>
                            <Text link={{ href: 'https://semi.design/', target:"_blank" }}>
                                {__("Rate", "mos-product-specifications-tab")}
                            </Text>                            
                        </Card>
                    </Col>
                </Row>
            </div>
        </FullWidthLayout>
        
    )
}
