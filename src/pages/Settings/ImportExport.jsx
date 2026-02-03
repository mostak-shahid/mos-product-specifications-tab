import { __ } from "@wordpress/i18n";
import apiFetch from '@wordpress/api-fetch';
import { useState } from 'react';
import { Row, Col, Typography, Skeleton, Button, Upload, Space, Toast, } from '@douyinfe/semi-ui';
import { IconDownload, IconUpload, IconTickCircle } from '@douyinfe/semi-icons';
import { SkeletonPlaceholder } from '../../components';

const { Title, Paragraph } = Typography;

const ImportExport = () => {
    const { Title, Text, Paragraph } = Typography;
    const [importData, setImportData] = useState('');
    const [processingImport, setProcessingImport] = useState(false);
    const [processingExport, setProcessingExport] = useState(false);
    const [fileList, setFileList] = useState([]);

    const handleExport = async() => {
        setProcessingExport(true);
        try {
            const data = await apiFetch({
                path: "/mos-product-specifications-tab/v1/options",
                method: 'GET'
            });
            if (data) {
                // setSettings(data);
                const blob = new Blob([JSON.stringify(data, null, 2)], {
                    type: 'application/json',
                });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'mos-product-specifications-tab-settings.json';
                link.click();
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setProcessingExport(false);
        }        
        // toast.success(__('Settings exported successfully', 'mos-product-specifications-tab'));
    };
    

    // Handle file upload with Semi Design Upload
    const handleFileChange = ({ fileList, currentFile }) => {
        setFileList(fileList);
        
        if (currentFile && currentFile.fileInstance) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const content = event.target.result;
                    JSON.parse(content); // Validate JSON
                    setImportData(content);
                    // toast.success(__('File loaded successfully', 'mos-product-specifications-tab'));
                } catch (err) {
                    // toast.error(__('Invalid JSON file', 'mos-product-specifications-tab'));
                    setFileList([]);
                    setImportData('');
                }
            };
            reader.readAsText(currentFile.fileInstance);
        }
    };

    // Handle file removal
    const handleRemove = () => {
        setImportData('');
        setFileList([]);
    };

    // Submit imported JSON
    const handleImport = async () => {
        setProcessingImport(true);
        console.log(importData);
        try {
            const parsed = JSON.parse(importData);
            const response = await apiFetch({
                path: '/mos-product-specifications-tab/v1/options/import-settings',
                method: 'POST',
                data: parsed,
            });

            if (response.success) {
                setProcessingImport(false);
                setFileList([]);
                setImportData('');
                Toast.success({
                    content: __("Settings imported successfully!", "mos-product-specifications-tab"),
                    duration: 3,
                    theme: 'light',
                    right: 15,
                });
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                // toast.error(__('Import failed', 'mos-product-specifications-tab'));
                setProcessingImport(false);
            }
        } catch (e) {
            // toast.error(__('Invalid JSON content', 'mos-product-specifications-tab'));
            console.log(e);
            setProcessingImport(false);
        } finally {
            setProcessingImport(false);
        }
    };
    return (
        <>
            <div className="setting-unit py-4">
                <Row type="flex" gutter={[24, 24 ]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Title heading={4}>{__("Export Settings", "mos-product-specifications-tab")}</Title>
                        <Paragraph>{__("Export your current settings", "mos-product-specifications-tab")}</Paragraph>
                    </Col>                                 
                    <Col xs={24} lg={12} xl={10}>
                        <Button     
                            type="primary" 
                            icon={<IconDownload />}                  
                            onClick={handleExport}
                        >
                            {__( "Export Settings", "mos-product-specifications-tab" )}
                        </Button>
                    </Col>
                </Row>
            </div>
            
            <div className="setting-unit pt-4">
                <Row type="flex" gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                            <Title heading={4}>{__("Import Settings", "mos-product-specifications-tab")}</Title>
                            <Paragraph>{__("Description", "mos-product-specifications-tab")}</Paragraph>
                    </Col>                                 
                    <Col xs={24} lg={12} xl={10}>
                        <Space vertical spacing='tight' align='start'>
                            <Upload
                                accept="application/json,.json"
                                action=""
                                fileList={fileList}
                                onChange={handleFileChange}
                                onRemove={handleRemove}
                                beforeUpload={() => false}
                                maxSize={5120}
                                limit={1}
                            >
                                <Button icon={<IconUpload />}>
                                    {__("Select JSON File", "mos-product-specifications-tab")}
                                </Button>
                            </Upload>
                            {importData &&
                                <Button
                                    icon={ !processingImport ? <IconTickCircle /> : null}
                                    onClick={handleImport}
                                    disabled={processingImport}
                                    loading={processingImport}
                                    type="primary"
                                >
                                    {processingImport
                                        ? __("Processing...", "mos-product-specifications-tab")
                                        : __("Import Settings", "mos-product-specifications-tab")
                                    }
                                </Button>
                            }
                        </Space>
                        <div>

                            {/* Hidden textarea with the JSON content */}
                            <textarea
                                style={{ display: 'none' }}
                                value={importData}
                                readOnly
                            ></textarea>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default ImportExport;