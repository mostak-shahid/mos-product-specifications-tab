import React from 'react'
import { __ } from "@wordpress/i18n";
import { Button } from '@douyinfe/semi-ui';
export default function ActionButtons({hasChanges, section, handleReset}) {

    const onReset = () => {
        handleReset(section);
    };
    return (
        <div className='mt-6'>
            <Button 
                type="primary" 
                theme='solid'
                htmlType="submit" 
                disabled={!hasChanges}
            >
                {__('Save Settings', 'mos-product-specifications-tab')}
            </Button>
            <Button
                type="danger" 
                theme='solid'
                style={{ marginLeft: '12px' }}
                onClick={onReset}
            >
                {__('Reset', 'mos-product-specifications-tab')}
            </Button>
        </div>
    )
}
