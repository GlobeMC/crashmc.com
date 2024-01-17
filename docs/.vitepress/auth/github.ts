import axios from "axios"
import cookies from "js-cookie"

export { getAuthToken, redirectToAuth, onAuthDone }

const GITHUB_CLIID = "dc5a44e3614c1250afa9"

const GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize"
const GITHUB_AUTH_TOKEN_URL = "https://api.crashmc.com/api/v1/gh_access_token/"
const GH_OAUTH_STATE_NAME = "_github_oauth_state"
const GH_OAUTH_TOKEN_NAME = "_github_oauth_token"

interface StateI {
  randstr: string
  redirect: string
}

function getAuthToken(): string | undefined {
  return cookies.get(GH_OAUTH_TOKEN_NAME)
}

function redirectToAuth(afterAuth: string | URL, scope?: string) {
  const randstr = btoa(
    String.fromCodePoint(...crypto.getRandomValues(new Uint8Array(63))),
  )
  cookies.set(
    GH_OAUTH_STATE_NAME,
    JSON.stringify({
      randstr: randstr,
      redirect: afterAuth.toString(),
    } as StateI),
    {
      secure: true,
      expires: 10 / (60 * 24), // in days
      sameSite: "strict",
    },
  )
  const authURL = new URL(GITHUB_AUTH_URL)
  authURL.searchParams.set("client_id", GITHUB_CLIID)
  authURL.searchParams.set("state", randstr)
  authURL.searchParams.set(
    "redirect_uri",
    new URL("/_auth_redirect.html", window.location.toString()).toString(),
  )
  if (scope) {
    authURL.searchParams.set("scope", scope)
  }
  window.location.assign(authURL.toString())
}

async function onAuthDone(): Promise<string | null> {
  const location = new URL(window.location.toString())
  const code = location.searchParams.get("code")
  const randstr = location.searchParams.get("state")
  if (!code || !randstr) {
    return null
  }
  var state: StateI
  try {
    state = JSON.parse(cookies.get(GH_OAUTH_STATE_NAME))
  } catch (err) {
    console.debug("Could not parse cookie", GH_OAUTH_STATE_NAME, err)
    return null
  }
  if (state.randstr !== randstr) {
    console.debug("Auth random state string not same, probably XSS attack")
    return null
  }
  var token: string
  try {
    const resp = await axios.post<string>(
      GITHUB_AUTH_TOKEN_URL,
      "code=" + escape(code),
    )
    const data = new URLSearchParams(resp.data)
    token = data.get("access_token")
  } catch (err) {
    console.error("auth failed:", err)
    return
  }
  cookies.set(GH_OAUTH_TOKEN_NAME, token, {
    secure: true,
    expires: 1,
  })
  return state.redirect
}
