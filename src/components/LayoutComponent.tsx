import FooterComponent from '@/components//FooterComponent/FooterComponent'
import HeaderComponent from '@/components/HeaderComponent/HeaderComponent'
import './LayoutComponent.module.scss'

function LayoutComponent({ children }: { children: React.ReactNode }) {
    return (
        <>
        <HeaderComponent/>
        {children}
        <FooterComponent/>
        </>
    )
}

export default LayoutComponent