import axios from "axios"
import cookies from "js-cookie"

export { getAuthToken, expireAuthToken, redirectToAuth, onAuthDone }

const AUTH_URL = "https://api.crashmc.com/api/oauth/github/"
const GH_OAUTH_STATE_NAME = "_github_oauth_state"
const GH_OAUTH_TOKEN_NAME = "_github_oauth_token"

interface StateI {
  stateId: string
  redirect: string
}

function getAuthToken(): string | undefined {
  return cookies.get(GH_OAUTH_TOKEN_NAME)
}

function expireAuthToken() {
  cookies.remove(GH_OAUTH_TOKEN_NAME)
}

function redirectToAuth(afterAuth: string | URL, scope?: string) {
  const stateId = btoa(
    String.fromCodePoint(...crypto.getRandomValues(new Uint8Array(63))),
  )
  cookies.set(
    GH_OAUTH_STATE_NAME,
    JSON.stringify({
      stateId: stateId,
      redirect: afterAuth.toString(),
    } as StateI),
    {
      secure: true,
      expires: 10 / (60 * 24), // in days
      sameSite: "strict",
    },
  )
  const authURL = new URL(AUTH_URL)
  authURL.searchParams.set("state", stateId)
  authURL.searchParams.set(
    "redirect_uri",
    window.location.origin + "/_auth_redirect.html",
  )
  if (scope) {
    authURL.searchParams.set("scope", scope)
  }
  window.location.assign(authURL.toString())
}

async function onAuthDone(): Promise<string | null> {
  const query = new URLSearchParams(window.location.search)
  const code = query.get("code")
  const stateId = query.get("state")
  if (!code || !stateId) {
    console.debug("URL Param 'code' or 'state' did not filled")
    return null
  }
  var state: StateI
  try {
    state = JSON.parse(cookies.get(GH_OAUTH_STATE_NAME) as string)
  } catch (err) {
    console.debug("Could not parse cookie", GH_OAUTH_STATE_NAME, err)
    return null
  }
  console.debug("state:", state)
  if (state.stateId !== stateId) {
    console.error("Auth random state string not same, probably XSS attack")
    return null
  }
  var token: string
  try {
    const resp = await axios.post<string>(AUTH_URL, "code=" + escape(code), {
      withCredentials: true,
    })
    const data = new URLSearchParams(resp.data)
    token = data.get("access_token") as string
  } catch (err) {
    console.error("auth failed:", err)
    return null
  }
  cookies.set(GH_OAUTH_TOKEN_NAME, token, {
    secure: true,
    expires: 1,
  })
  return state.redirect
}
