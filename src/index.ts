// ref:
// - https://umijs.org/plugins/api
import { IApi } from '@umijs/types';
import { IRoute } from '@umijs/core';
import _ from '@umijs/deps/compiled/lodash';
import { utils } from 'umi';
import { readFileSync } from 'fs';
import { join } from 'path';

const add404 = (routes: IRoute[]) =>
  routes.push({
    name: '页面未找到',
    component: '@@/plugin-panel-tabs/Result/404',
    wrappers: ['@@/plugin-panel-tabs/Wrappers/PanelTabsWrapper'],
  });

const generatorWrappers = (useAuth: boolean) => {
  if (useAuth) {
    return ['@@/plugin-panel-tabs/Wrappers/PanelTabsAndRouteAuthWrapper'];
  }
  return ['@@/plugin-panel-tabs/Wrappers/PanelTabsWrapper'];
};

const modifyRoutes = (
  routes: IRoute[],
  topRoute: boolean,
  use404: boolean,
  useAuth: boolean,
  intlMenuKey: string,
) => {
  routes.forEach((x) => {
    if (x.hideInPanelTab !== true && x.name) {
      x.intlMenuKey = `${intlMenuKey}.${x.name}`;
      if (x.wrappers && x.wrappers.length > 0) {
        x.wrappers.push(...generatorWrappers(useAuth));
      } else {
        x.wrappers = generatorWrappers(useAuth);
      }
    }
    if (x.routes) {
      x.routes = modifyRoutes(
        x.routes,
        false,
        use404,
        useAuth,
        x.intlMenuKey || intlMenuKey,
      );
    }
  });
  if (!topRoute) {
    if (use404) {
      add404(routes);
    }
  }
  return routes;
};

export default function(api: IApi) {
  api.describe({
    key: 'panelTab',
    config: {
      default: {
        use404: true,
        useAuth: false,
        autoI18n: false,
        tabsBarBackgroundColor: '#FFFFFF',
        tabsTagColor: '#1890ff',
        tabsLimit: 10,
        tabsLimitWait: 1500,
        tabsLimitWarnContent: '您当前打开页面过多, 请关闭不使用的页面以减少卡顿!',
      },
      schema(joi) {
        return joi.object({
          use404: joi.boolean(),
          useAuth: joi.boolean(),
          autoI18n: joi.boolean(),
          tabsBarBackgroundColor: joi.string(),
          tabsTagColor: joi.string(),
          tabsLimit: joi.number(),
          tabsLimitWait: joi.number(),
          tabsLimitWarnContent: joi.string(),
        });
      },
      onChange: api.ConfigChangeType.regenerateTmpFiles,
    },
    enableBy: api.EnableBy.register,
  });

  api.modifyRoutes((routes: IRoute[]) =>
    modifyRoutes(
      _.clone(routes),
      true,
      api.config.panelTab.use404,
      api.config.panelTab.useAuth,
      'menu',
    ),
  );
  const pluginPath = 'plugin-panel-tabs';
  api.addUmiExports(() => [
    {
      exportAll: true,
      source: `../${pluginPath}`,
    },
  ]);
  api.onGenerateFiles(async () => {
    const files = [
      'index.ts',
      'PanelTabs/index.tsx',
      'PanelTabs/index.less',
      'PanelTabs/PanelTab.tsx',
      'PanelTabs/PanelTabHook.ts',
      'Wrappers/PanelTabsWrapper.tsx',
      'Wrappers/PanelTabsAndRouteAuthWrapper.tsx',
      'Wrappers/RouteAuthWrapper.tsx',
      'Result/404.tsx',
    ];
    const viewVars = {
      ...api.config.panelTab,
      useI18n: api.userConfig?.locale && api.config.panelTab?.autoI18n,
      useAntPrimaryColor: api.config.panelTab?.tabsTagColor?.startsWith('#') === true,
    };
    files.forEach(filename => {
      api.writeTmpFile({
        path: `${pluginPath}/${filename}`,
        content: utils.Mustache.render(
          readFileSync(join(__dirname, `${filename}.tpl`), 'utf-8'),
          viewVars,
          {},
          ['{{{', '}}}'],
        ),
      });
    });
  });

  const registerPlugins = [];

  if (!api.hasPlugins(['umi-plugin-keep-alive'])) {
    registerPlugins.push(require.resolve('umi-plugin-keep-alive'));
  }

  if (!api.hasPlugins(['@umijs/plugin-antd'])) {
    registerPlugins.push(require.resolve('@umijs/plugin-antd'));
  }

  if (
    api.userConfig?.locale &&
    api.userConfig.panelTab?.autoI18n &&
    !api.hasPlugins(['@umijs/plugin-locale'])
  ) {
    registerPlugins.push(require.resolve('@umijs/plugin-locale'));
  }

  if (registerPlugins.length > 0) {
    api.registerPlugins(registerPlugins);
  }

  return {
    plugins: [
      require.resolve('umi-plugin-keep-alive'),
      require.resolve('@umijs/plugin-antd'),
    ],
  };
}
