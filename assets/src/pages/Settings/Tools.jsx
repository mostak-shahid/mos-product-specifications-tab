import { __ } from "@wordpress/i18n";
import apiFetch from "@wordpress/api-fetch";
import {
    Form,
    Row,
    Col,
    Skeleton,
    Button,
    Typography,
    Toast,
} from "@douyinfe/semi-ui";
import { IconRefresh, IconCopy } from "@douyinfe/semi-icons";
import { useOutletContext } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { SkeletonPlaceholder } from "../../components";
import ActionButtons from "./ActionButtons";

const { Title, Paragraph } = Typography;

/* ----------------------------------
   Clipboard helper with fallback
----------------------------------- */
const copyToClipboard = (value) => {
    if (!value) {
        Toast.error("No text to copy");
        return;
    }

    // Modern approach - works in HTTPS and localhost
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value)
            .then(() => {
                Toast.success("Copied to clipboard");
            })
            .catch((err) => {
                console.error("Clipboard API failed:", err);
                fallbackCopyToClipboard(value);
            });
    } else {
        // Fallback for older browsers or non-HTTPS contexts
        fallbackCopyToClipboard(value);
    }
};

/* ----------------------------------
   Fallback clipboard method
----------------------------------- */
const fallbackCopyToClipboard = (value) => {
    const textArea = document.createElement("textarea");
    textArea.value = value;
    
    // Make it invisible
    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";
    textArea.style.left = "-9999px";
    textArea.style.opacity = "0";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            Toast.success("Copied to clipboard");
        } else {
            Toast.error("Failed to copy");
        }
    } catch (err) {
        console.error("Fallback copy failed:", err);
        Toast.error("Copy not supported in this browser");
    } finally {
        document.body.removeChild(textArea);
    }
};

const Tools = () => {
    const {
        settings,
        settingsLoading,
        handleSubmit,
        handleReset,
        setSettingsReload,
    } = useOutletContext();

    const [hasChanges, setHasChanges] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [deactivationUrl, setDeactivationUrl] = useState("");
    const [deactivationLoading, setDeactivationLoading] = useState(true);
    const [deactivationError, setDeactivationError] = useState(null);

    const formApi = useRef(null);
    const settingsOld = useRef(null);
    
    /* ----------------------------------
       Fetch deactivation link
    ----------------------------------- */
    useEffect(() => {
        const fetchDeactiveLink = async () => {
            setDeactivationLoading(true);
            setDeactivationError(null);
            
            try {
                const response = await apiFetch({ 
                    path: `/mos-product-specifications-tab/v1/deactivation-link` 
                });
                
                if (response.success && response.deactivation_url) {
                    setDeactivationUrl(response.deactivation_url);
                    
                    // Set the URL in the form
                    formApi.current?.setValue("deactivation_url", response.deactivation_url);
                } else {
                    throw new Error(response.message || "Failed to fetch deactivation URL");
                }
            } catch (error) {
                console.error("Error fetching deactivation link:", error);
                setDeactivationError(error.message || "Failed to load deactivation URL");
                
                Toast.error({
                    content: __("Error fetching deactivation URL", "mos-product-specifications-tab"),
                    theme: "light",
                });
            } finally {
                setDeactivationLoading(false);
            }
        };
        
        // Only fetch if form API is ready
        if (formApi.current) {
            fetchDeactiveLink();
        }
    }, [settings]); // Re-fetch when settings change

    /* ----------------------------------
       Submit
    ----------------------------------- */
    const onSubmit = (values) => {
        handleSubmit("tools", values);
    };

    /* ----------------------------------
       Detect changes
    ----------------------------------- */
    const handleValuesChange = (values) => {
        if (settingsOld.current?.tools) {
            const isChanged =
                JSON.stringify(values) !==
                JSON.stringify(settingsOld.current.tools);
            setHasChanges(isChanged);
        }
    };

    /* ----------------------------------
       Sync form when settings load
    ----------------------------------- */
    useEffect(() => {
        if (settings?.tools) {
            settingsOld.current = { ...settings };

            formApi.current?.setValues({
                ...settings.tools,
                deactivation_url: deactivationUrl || __("Loading...", "mos-product-specifications-tab"),
            });

            setHasChanges(false);
        }
    }, [settings, deactivationUrl]);

    /* ----------------------------------
       Reset handler
    ----------------------------------- */
    const handleClick = async () => {
        const confirmation = window.confirm(
            __("Are you sure you want to proceed?", "mos-product-specifications-tab")
        );

        if (!confirmation) return;

        setProcessing(true);

        try {
            const result = await apiFetch({
                path: "/mos-product-specifications-tab/v1/options/reset-settings-all",
                method: "POST",
            });

            if (result.success) {
                Toast.success({
                    content: __("Settings reset successfully!", "mos-product-specifications-tab"),
                    theme: "light",
                });
            } else {
                throw new Error("Reset failed");
            }
        } catch (error) {
            Toast.error({
                content: __("Error resetting settings.", "mos-product-specifications-tab"),
                theme: "light",
            });
        } finally {
            setProcessing(false);
            setSettingsReload?.(Math.random());
        }
    };

    return (
        <>
            {!settingsLoading && settings?.tools && (
                <Form
                    getFormApi={(api) => (formApi.current = api)}
                    initValues={{
                        ...settings.tools,
                        deactivation_url: deactivationUrl || __("Loading...", "mos-product-specifications-tab"),
                    }}
                    onSubmit={onSubmit}
                    onValueChange={handleValuesChange}
                    labelPosition="left"
                    labelWidth="150px"
                >
                    {/* -------------------------
                       Hide Plugin section
                    -------------------------- */}
                    <div className="setting-unit py-4">
                        <Row gutter={[24, 24]}>
                            <Col xs={24} lg={12} xl={14}>
                                <Skeleton
                                    placeholder={<SkeletonPlaceholder />}
                                    loading={settingsLoading}
                                    active
                                >
                                    <Title heading={4}>
                                        {__(
                                            "Hide Plugin",
                                            "mos-product-specifications-tab"
                                        )}
                                    </Title>
                                    <Paragraph>
                                        {__(
                                            "Hide this plugin from plugin list.",
                                            "mos-product-specifications-tab"
                                        )}
                                    </Paragraph>
                                </Skeleton>
                            </Col>

                            <Col xs={24} lg={12} xl={10}>
                                <Form.Switch 
                                    field='hide_plugin' 
                                    noLabel
                                />
                            </Col>
                        </Row>
                    </div>
                    {/* -------------------------
                       Self Defense section
                    -------------------------- */}
                    <div className="setting-unit py-4">
                        <Row gutter={[24, 24]}>
                            <Col xs={24} lg={12} xl={14}>
                                <Skeleton
                                    placeholder={<SkeletonPlaceholder />}
                                    loading={settingsLoading}
                                    active
                                >
                                    <Title heading={4}>
                                        {__(
                                            "Self Defense",
                                            "mos-product-specifications-tab"
                                        )}
                                    </Title>
                                    <Paragraph>
                                        {__(
                                            "Password requirement for Deactivation.",
                                            "mos-product-specifications-tab"
                                        )}
                                    </Paragraph>
                                </Skeleton>
                            </Col>

                            <Col xs={24} lg={12} xl={10}>
                                <Form.Switch 
                                    field='self_defense' 
                                    noLabel
                                />
                            </Col>
                        </Row>
                    </div>
                    {/* -------------------------
                       Delete data section
                    -------------------------- */}
                    <div className="setting-unit py-4">
                        <Row gutter={[24, 24]}>
                            <Col xs={24} lg={12} xl={14}>
                                <Skeleton
                                    placeholder={<SkeletonPlaceholder />}
                                    loading={settingsLoading}
                                    active
                                >
                                    <Title heading={4}>
                                        {__(
                                            "Delete all the plugin data upon",
                                            "mos-product-specifications-tab"
                                        )}
                                    </Title>
                                    <Paragraph>
                                        {__(
                                            "Plugin data management.",
                                            "mos-product-specifications-tab"
                                        )}
                                    </Paragraph>
                                </Skeleton>
                            </Col>

                            <Col xs={24} lg={12} xl={10}>
                                <Form.Select
                                    noLabel
                                    field="delete_data_on"
                                    optionList={[
                                        { label: __("None", "mos-product-specifications-tab"), value: "none" },
                                        { label: __("Delete", "mos-product-specifications-tab"), value: "delete" },
                                        { label: __("Deactivate", "mos-product-specifications-tab"), value: "deactivate" },
                                    ]}
                                />
                            </Col>
                        </Row>
                    </div>

                    {/* -------------------------
                       Reset section
                    -------------------------- */}
                    <div className="setting-unit pt-4">
                        <Row gutter={[24, 24]} align="middle">
                            <Col xs={24} lg={12} xl={14}>
                                <Title heading={4}>
                                    {__("Reset Plugin", "mos-product-specifications-tab")}
                                </Title>
                                <Paragraph>
                                    {__("Reset Plugin to it's default settings", "mos-product-specifications-tab")}
                                </Paragraph>
                            </Col>

                            <Col xs={24} lg={12} xl={10}>
                                <Button
                                    type="danger"
                                    icon={<IconRefresh />}
                                    loading={processing}
                                    onClick={handleClick}
                                >
                                    {processing
                                        ? __("Resetting...", "mos-product-specifications-tab")
                                        : __("Reset All", "mos-product-specifications-tab")}
                                </Button>
                            </Col>
                        </Row>
                    </div>

                    {/* -------------------------
                       Deactivate Plugin URL section
                    -------------------------- */}
                    <div className="setting-unit pt-4">
                        <Row gutter={[24, 24]} align="middle">
                            <Col xs={24} lg={12} xl={14}>
                                <Title heading={4}>
                                    {__("Deactivate Plugin URL", "mos-product-specifications-tab")}
                                </Title>
                                <Paragraph>
                                    {deactivationError 
                                        ? deactivationError
                                        : __("Use this secure URL to deactivate the plugin. This link will only work once.", "mos-product-specifications-tab")
                                    }
                                </Paragraph>
                            </Col>

                            <Col xs={24} lg={12} xl={10}>
                                <Form.Input
                                    noLabel
                                    field="deactivation_url"
                                    readOnly
                                    disabled={deactivationLoading || !!deactivationError}
                                    placeholder={
                                        deactivationLoading 
                                            ? __("Loading...", "mos-product-specifications-tab")
                                            : deactivationError
                                            ? __("Failed to load URL", "mos-product-specifications-tab")
                                            : __("Deactivation URL", "mos-product-specifications-tab")
                                    }
                                    suffix={
                                        <Button
                                            theme="borderless"
                                            icon={<IconCopy />}
                                            disabled={deactivationLoading || !!deactivationError || !deactivationUrl}
                                            onClick={() =>
                                                copyToClipboard(
                                                    formApi.current?.getValue("deactivation_url")
                                                )
                                            }
                                        />
                                    }
                                />
                            </Col>
                        </Row>
                    </div>

                    {/* -------------------------
                       Save / Reset buttons
                    -------------------------- */}
                    <ActionButtons
                        hasChanges={hasChanges}
                        section="tools"
                        handleReset={handleReset}
                    />
                </Form>
            )}
        </>
    );
};

export default Tools;