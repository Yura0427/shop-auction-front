import React, { FC } from 'react';
import {IPageProps} from "../interfaces/page";
import {useCategories} from "../hooks/useCategories";
import {IBreadcrumbsData} from "../interfaces/breadcrumbsData";
import MainLayout from "../components/layout/MainLayout";
import {PageContainer} from "@containers/page-container";
import {GetStaticProps} from "next";
import {api} from "../api";
import BuyAll from "./buyAll";

const About: FC<IPageProps> = ({categories}) => {
    const { allCategories } = useCategories(categories);

    const breadcrumbsData: IBreadcrumbsData = {
        isBreadcrumbsShown: true,
        breadcrumbs: [
            { name: 'Головна', key: '/' },
            { name: 'Про нас', key: '' },
        ],
    };

    const metaData = {
        title: 'Про нас',
        description: 'Коротко про нас',
        addBrand: true,
    };

    return (
        <MainLayout metaData={metaData}>
            <PageContainer categories={allCategories!} breadcrumbsData={breadcrumbsData}>
                <BuyAll/>
             </PageContainer>
         </MainLayout>
    )
}

export default About;

export const getStaticProps: GetStaticProps = async () => {
    const { data: categories } = await api.categories.getTree();

    return {
        revalidate: 60,
        props: {
            categories,
        },
    };
};

