import React from 'react';
import SuperButton from "../../commponents/c2-SuperButton/SuperButton";
import SuperCheckbox from "../../commponents/c3-SuperCheckbox/SuperCheckbox";
import SuperInputText from "../../commponents/c1-SuperInputText/SuperInputText";
import SuperEditableSpan from "../../commponents/c4-SuperEditableSpan/SuperEditableSpan";
import SuperSelect from "../../commponents/c5-SuperSelect/SuperSelect";
import SuperRadio from "../../commponents/c6-SuperRadio/SuperRadio";
import style from './testPage.module.css'

const TestPage = () => {

    return (
        <div className={style.testPage}>
            <SuperInputText/>
            <SuperButton>Super Button</SuperButton>
            <SuperCheckbox/>
            <SuperEditableSpan/>
            <SuperSelect/>
            <SuperRadio/>
        </div>
    );
};

export default TestPage;