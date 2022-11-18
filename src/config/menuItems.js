import AccountBoxIcon from '@material-ui/icons/AccountBox'
import ChatBubble from '@material-ui/icons/ChatBubble'
import ChromeReaderMode from '@material-ui/icons/ChromeReaderMode'
import DaschboardIcon from '@material-ui/icons/Dashboard'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import FilterList from '@material-ui/icons/FilterList'
import GetApp from '@material-ui/icons/GetApp'
import InfoOutlined from '@material-ui/icons/InfoOutlined'
import LanguageIcon from '@material-ui/icons/Language'
import LockIcon from '@material-ui/icons/Lock'
import MenuOpenIcon from '@material-ui/icons/MenuOpen'
import QuestionAnswer from '@material-ui/icons/QuestionAnswer'
import React from 'react'
import SettingsIcon from '@material-ui/icons/SettingsApplications'
import StyleIcon from '@material-ui/icons/Style'
import Tab from '@material-ui/icons/Tab'
import ViewList from '@material-ui/icons/ViewList'
import Web from '@material-ui/icons/Web'
import allLocales from './locales'
import allThemes from './themes'

const getMenuItems = (props) => {
  const {
    intl,
    updateLocale,
    locale,
    menuContext,
    themeContext,
    a2HSContext,
    auth: authData,
  } = props
  const { isDesktop, isAuthMenuOpen, useMiniMode, setMiniMode } = menuContext
  const { themeID, setThemeID } = themeContext
  const { auth, setAuth } = authData
  const { isAppInstallable, isAppInstalled, deferredPrompt } = a2HSContext

  const localeItems = allLocales.map((l) => {
    return {
      value: undefined,
      visible: true,
      primaryText: intl.formatMessage({ id: l.locale }),
      onClick: () => {
        updateLocale(l.locale)
      },
      leftIcon: <LanguageIcon />,
    }
  })

  const isAuthorised = auth.isAuthenticated

  const themeItems = allThemes.map((t) => {
    return {
      value: undefined,
      visible: true,
      primaryText: intl.formatMessage({ id: t.id }),
      onClick: () => {
        setThemeID(t.id)
      },
      leftIcon: <StyleIcon style={{ color: t.color }} />,
    }
  })

  if (isAuthMenuOpen || !isAuthorised) {
    return [
      {
        value: '/my_account',
        primaryText: intl.formatMessage({
          id: 'my_account',
          defaultMessage: 'My Account',
        }),
        leftIcon: <AccountBoxIcon />,
      },
      {
        value: '/signin',
        onClick: isAuthorised
          ? () => {
              setAuth({ isAuthenticated: false })
            }
          : () => {},
        visible: true,
        primaryText: isAuthorised
          ? intl.formatMessage({ id: 'sign_out' })
          : intl.formatMessage({ id: 'sign_in' }),
        leftIcon: isAuthorised ? <ExitToAppIcon /> : <LockIcon />,
      },
    ]
  }
  return [
    {
      value: '/',
      visible: isAuthorised,
      primaryText: intl.formatMessage({ id: 'home' }),
      leftIcon: <DaschboardIcon />,
    },
    {
      primaryText: intl.formatMessage({ id: 'cadastro', defaultMessage: 'Cadastro' }),
      primaryTogglesNestedList: true,
      leftIcon: <Web  titleAccess='Cadastros'/>,
      nestedItems: [
        {
          value: '/CadastroEmpresa',
          visible: isAuthorised,
          primaryText: intl.formatMessage({
            id: 'CadastroEmpresa',
            defaultMessage: 'Empresa',
          }),
          leftIcon: <ChatBubble titleAccess='Cadastro Empresa'/>,
        },
        {
          value: '/CadastroAtributos',
          visible: isAuthorised,
          primaryText: intl.formatMessage({
            id: 'CadastroAtributos',
            defaultMessage: 'Atributos',
          }),
          leftIcon: <ChatBubble titleAccess='Cadastro Atributos'/>,
        },
        
        {
          value: '/CadastroUc',
          visible: isAuthorised,
          primaryText: intl.formatMessage({
            id: 'CadastroUc',
            defaultMessage: 'Unidade Consumidora',
          }),
          leftIcon: <FilterList titleAccess='Cadastro UC'/>,
        },
        {
          value: '/CadastroFatura',
          visible: isAuthorised,
          primaryText: intl.formatMessage({
            id: 'CadastroFatura',
            defaultMessage: 'Fatura',
          }),
          leftIcon: <ViewList titleAccess='Cadastro Fatura'/>,
        },
        {
          value: '/CadastroFaturaMascaraPdf',
          visible: isAuthorised,
          primaryText: intl.formatMessage({
            id: 'CadastroFaturaMascaraPdf',
            defaultMessage: 'Mascara Fatura',
          }),
          leftIcon: <ViewList titleAccess='Mascara Fatura'/>,
        },
        {
          value: '/WindowConstrutor',
          visible: isAuthorised,
          primaryText: intl.formatMessage({
            id: 'WindowConstrutor',
            defaultMessage: 'Construtor de Janelas',
          }),
          leftIcon: <ViewList titleAccess='View'/>,
        },
        
        {
          value: '/CadastroUser',
          visible: isAuthorised,
          primaryText: intl.formatMessage({
            id: 'CadastroUser',
            defaultMessage: 'Usuários',
          }),
          leftIcon: <ViewList titleAccess='Cadastro de usuários'/>,
        },
        
      ],
    },
    {
      primaryText: intl.formatMessage({ id: 'visualizações', defaultMessage: 'Visualizações' }),
      primaryTogglesNestedList: true,
      leftIcon: <Web />,
      nestedItems: [
        {
          value: '/IndicadoresComparativo',
          visible: isAuthorised,
          primaryText: intl.formatMessage({
            id: 'IndicadoresComparativo',
            defaultMessage: 'Comparativo',
          }),
          leftIcon: <ChatBubble  titleAccess='Indicadores comparativos UCs'/>,
        },
        {
          value: '/IndicadoresUc',
          visible: isAuthorised,
          primaryText: intl.formatMessage({
            id: 'IndicadoresUc',
            defaultMessage: 'Unidade Consumidora',
          }),
          leftIcon: <FilterList  titleAccess='Indicadores UC'/>,
        },
      ],
    },
    {
      primaryText: intl.formatMessage({ id: 'extratos', defaultMessage: 'Extratos' }),
      primaryTogglesNestedList: true,
      leftIcon: <Web />,
      nestedItems: [
        {
          value: '/ExtratoFaturasMensal',
          visible: isAuthorised,
          primaryText: intl.formatMessage({
            id: 'extradoFaturasMensal',
            defaultMessage: 'Faturas mensal',
          }),
          leftIcon: <ChatBubble  titleAccess='Extrato Faturas com Vencimento para o mês'/>,
        },
      ],
    },
    {
      value: '/PrevisaoConsumo',
      visible: true,
      primaryText: intl.formatMessage({ id: 'PrevisaoConsumo' }),
      leftIcon: <InfoOutlined  titleAccess='Previsao Consumo'/>,
    },
    { divider: true },
    {
      primaryText: intl.formatMessage({ id: 'settings' }),
      primaryTogglesNestedList: true,
      leftIcon: <SettingsIcon  titleAccess='Configurações' />,
      nestedItems: [
        {
          primaryText: intl.formatMessage({ id: 'theme' }),
          secondaryText: intl.formatMessage({ id: themeID }),
          primaryTogglesNestedList: true,
          leftIcon: <StyleIcon  titleAccess='Theme'/>,
          nestedItems: themeItems,
        },
        {
          primaryText: intl.formatMessage({ id: 'language' }),
          secondaryText: intl.formatMessage({ id: locale }),
          primaryTogglesNestedList: true,
          leftIcon: <LanguageIcon  titleAccess='Idiomas'/>,
          nestedItems: localeItems,
        },
        {
          visible: isDesktop ? true : false,
          onClick: () => {
            setMiniMode(!useMiniMode)
          },
          primaryText: intl.formatMessage({
            id: 'menu_mini_mode',
          }),
          leftIcon: useMiniMode ? <MenuOpenIcon /> : <ChromeReaderMode />,
        },
      ],
    },
    {
      value: null,
      visible: isAppInstallable && !isAppInstalled,
      onClick: () => {
        deferredPrompt.prompt()
      },
      primaryText: intl.formatMessage({
        id: 'install',
        defaultMessage: 'Install',
      }),
      leftIcon: <GetApp />,
    },
  ]
}
export default getMenuItems
