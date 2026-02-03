import { __ } from "@wordpress/i18n";
import { Typography, Space, Table, Card, Button} from '@douyinfe/semi-ui';
import { IconVerify, IconCrown, IconClose, } from '@douyinfe/semi-icons';

import {BoxedLayout} from '../layouts';
const FreeVsPro = () => {
    const { Text, Title, Paragraph } = Typography;
    const columns = [
        {
            title: 'Features',
            dataIndex: 'feature',
        },
        {
            title: 'Free',
            dataIndex: 'free',
        },
        {
            title: <Space><IconCrown /><Text>Pro</Text></Space>,
            dataIndex: 'pro',
        },
    ];
    const data = [
        {
            key: '1',
            feature: 'Semi Design design draft.fig',
            free: <IconClose />,
            pro: <IconVerify />,
        },
        {
            key: '2',
            feature: 'Semi Design share docs',
            free: <IconClose />,
            pro: <IconVerify />,
        },
        {
            key: '3',
            feature: 'Design docs',
            free: <IconClose />,
            pro: <IconVerify />,
        },
        {
            key: '4',
            feature: 'Semi Design design draft.fig',
            free: <IconClose />,
            pro: <IconVerify />,
        },
        {
            key: '5',
            feature: 'Semi Design share docs',
            free: <IconClose />,
            pro: <IconVerify />,
        },
        {
            key: '6',
            feature: 'Design docs',
            free: <IconClose />,
            pro: <IconVerify />,
        },
        {
            key: '7',
            feature: 'Semi Design design draft.fig',
            free: <IconClose />,
            pro: <IconVerify />,
        },
        {
            key: '8',
            feature: 'Semi Design share docs',
            free: <IconClose />,
            pro: <IconVerify />,
        },
        {
            key: '9',
            feature: 'Design docs',
            free: <IconClose />,
            pro: <IconVerify />,
        },
    ];
    return (
        <BoxedLayout>
            <Table 
                columns={columns} 
                dataSource={data} 
                pagination={false}
                bordered
                className="mb-6"
            />
            
            <Card
                className="text-center"
            >
                <Title 
                    heading={2}
                    style={{marginBottom: 8}}
                >
                    {__("Ready to Upgrade to Pro?", "mos-product-specifications-tab")}
                </Title>
                <Paragraph style={{marginBottom: 4}}>
                    {__("Unlock the full potential of Mos Product Specifications Tab by upgrading to the Pro version. Enjoy advanced features, premium support, and exclusive updates designed to enhance your website.", "mos-product-specifications-tab")}    
                </Paragraph>
                <Paragraph>
                    {__("Don't miss out on the benefits of Mos Product Specifications Tab Pro. Upgrade today and take your website to the next level!", "mos-product-specifications-tab")}
                </Paragraph>
                <Space style={{marginTop: 8}}>
                    <Button
                        theme="solid"
                        type="primary"
                         icon={<IconCrown />}
                    >
                        {__("Upgrade to Pro Now!", "mos-product-specifications-tab")}
                    </Button>
                    <Button
                        theme="outline"
                        type="primary"
                    >
                        {__("See All Features", "mos-product-specifications-tab")}
                    </Button>
                    <Button
                        theme="outline"
                        type="warning"
                    >
                        {__("Pro Live Demo", "mos-product-specifications-tab")}
                    </Button>
                </Space>
            </Card>
        </BoxedLayout>
    );
};

export default FreeVsPro;