import env from './env'

export default {
  env,
  isDevMode: env.NODE_ENV === 'dev',
  isProdMode: env.NODE_ENV === 'prod',

  useBabel: false, // 是否使用babel转译
}
