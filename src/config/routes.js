/* eslint-disable react/jsx-key */
import React, { lazy } from 'react'
import AuthorizedRoute from 'base-shell/lib/components/AuthorizedRoute/AuthorizedRoute'
import UnauthorizedRoute from 'base-shell/lib/components/UnauthorizedRoute/UnauthorizedRoute'
import { Route } from 'react-router-dom'

const SignIn = lazy(() => import('../pages/SignIn/SignIn'))
const SignUp = lazy(() => import('../pages/SignUp/SignUp'))
const PasswordReset = lazy(() => import('../pages/PasswordReset/PasswordReset'))
const About = lazy(() => import('../pages/About'))
const Home = lazy(() => import('../pages/Home/Home'))
//const DialogDemo = lazy(() => import('../pages/DialogDemo/DialogDemo'))
const ToastDemo = lazy(() => import('../pages/ToastDemo/ToastDemo'))
const FilterDemo = lazy(() => import('../pages/FilterDemo'))
const ListPageDemo = lazy(() => import('../pages/ListPageDemo'))
const TabsDemo = lazy(() => import('../pages/TabsDemo'))
const MyAccount = lazy(() => import('../pages/MyAccount/MyAccount'))
const ChangePassword = lazy(() => import('../pages/PasswordReset/ChangePassword'))
const CadastroEmpresa = lazy(() => import('../pages/CadastroEmpresa/CadastroEmpresa'))
const CadastroUc = lazy(() => import('../pages/CadastroUc/CadastroUc'))
const CadastroFatura = lazy(() => import('../pages/CadastroFatura/CadastroFatura'))
const CadastroUser = lazy(() => import('../pages/CadastroUser/CadastroUser'));

const IndicadorComparativo = lazy(() => import('../pages/IndicadoresComparativo/IndicadoresComparativo'))
const IndicadoresUc = lazy(() => import('../pages/IndicadoresUc/IndicadoresUc'))
const ExtratoFaturasMensal = lazy(() => import('../pages/Extratos/ExtratoFaturasMensal/ExtratoFaturasMensal'))
const PrevisaoConsumo = lazy(() => import('../pages/PrevisaoConsumo/PrevisaoConsumo'));
const CadastroFaturaMascaraPdf = lazy(() => import('../pages/CadastroFaturaMascaraPdf/CadastroFaturaMascaraPdf'))
const CadastroAtributos = lazy(() => import('../pages/CadastroAtributos/CadastroAtributos'));
const WindowConstrutor = lazy(() => import ('../pages/WindowConstrutor/WindowConstrutor'))

const routes = [
  <UnauthorizedRoute path="/signin"  exact component={SignIn} />,
  <UnauthorizedRoute path="/signup" redirectTo="/" exact component={SignUp} />,
  <UnauthorizedRoute
    path="/password_reset"
    redirectTo="/"
    exact
    component={PasswordReset}
  />,
  <Route path="/about" exact component={About} />,
  <AuthorizedRoute path="/my_account" exact component={MyAccount} />,
  <AuthorizedRoute path="/home" exact component={Home} />,
  <AuthorizedRoute path="/CadastroEmpresa" exact component={CadastroEmpresa} />,
  <AuthorizedRoute path="/CadastroUc" exact component={CadastroUc} />,
  <AuthorizedRoute path="/CadastroFatura" exact component={CadastroFatura} />,
  <AuthorizedRoute path="/CadastroUser" exact component={CadastroUser} />,
  <AuthorizedRoute path="/IndicadoresComparativo" exact component={IndicadorComparativo} />,
  <AuthorizedRoute path="/IndicadoresUc" exact component={IndicadoresUc} />,
  <AuthorizedRoute path="/WindowConstrutor" exact component={WindowConstrutor} />, 
  

  <AuthorizedRoute path="/ExtratoFaturasMensal" exact component={ExtratoFaturasMensal}/>,
  <AuthorizedRoute path="/PrevisaoConsumo" exact component={PrevisaoConsumo}/>,
  <AuthorizedRoute path="/CadastroFaturaMascaraPdf" exact component={CadastroFaturaMascaraPdf}/>,
  <AuthorizedRoute path="/CadastroAtributos" exact component={CadastroAtributos}/>,
  
  <AuthorizedRoute path="/toast_demo" exact component={ToastDemo} />,
  <AuthorizedRoute path="/filter_demo" exact component={FilterDemo} />,
  <AuthorizedRoute path="/list_page_demo" exact component={ListPageDemo} />,
  <AuthorizedRoute path="/tabs_demo" exact component={TabsDemo} />,
  <Route path="/change_password" exact component={ChangePassword} />,
]

export default routes
