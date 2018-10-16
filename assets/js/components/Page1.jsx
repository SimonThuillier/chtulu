import React from 'react';
import ArticleTypeSelect from './ArticleTypeSelect';


const Page1 = (props) => {
    return (
        <div className="content-wrapper hb-container">
            <section className="content-header">
            </section>
            <section className="content">
                <p>Page 1</p>
                <ArticleTypeSelect {...props}/>
            </section>
        </div>
    )
};

export default Page1;