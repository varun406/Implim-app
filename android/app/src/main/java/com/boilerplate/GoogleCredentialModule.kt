package com.boilerplate

import android.annotation.SuppressLint
import android.util.Base64
import android.util.Log
import androidx.credentials.CreateCredentialResponse
import androidx.credentials.CreatePasswordRequest
import androidx.credentials.CreatePublicKeyCredentialRequest
import androidx.credentials.GetCredentialResponse
import androidx.credentials.GetPasswordOption
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import androidx.credentials.GetPublicKeyCredentialOption
import androidx.credentials.PasswordCredential
import androidx.credentials.PublicKeyCredential
import androidx.credentials.exceptions.CreateCredentialException
import androidx.credentials.exceptions.GetCredentialException
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableMap
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.json.JSONArray
import org.json.JSONObject
import java.security.SecureRandom

class GoogleCredentialModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "GoogleCredentialModule"

   private fun generateChallenge(): String {
        val random = SecureRandom()
        val challengeBytes = ByteArray(32) // 256 bits
        random.nextBytes(challengeBytes)
        return Base64.encodeToString(challengeBytes, Base64.URL_SAFE or Base64.NO_WRAP)
    }


    private val credentialManager = androidx.credentials.CredentialManager.create(reactContext)

    val requestJson = JSONObject().apply {
        put("challenge", generateChallenge()) // Base64URL-encoded challenge
        put("timeout", 60000) // Reasonable timeout (60 sec)
        put("rpId", "openspaceservices.com") // Ensure this matches your relying party ID
        put("allowCredentials", JSONArray()) // Allow all credentials
        put("userVerification", "preferred") // Allow "preferred" instead of "required"
    }.toString()

    @ReactMethod
    fun createCalendarEvent(name: String, location: String) {
        Log.d("CalendarModule", "Create event called with name: $name and location: $location")
    }

    @ReactMethod
    fun setPassword(username: String, password: String, promise: Promise) {
        val activity = currentActivity
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "Activity is null")
            return
        }

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val createPasswordRequest = CreatePasswordRequest(username, password)
                credentialManager.createCredential(activity, createPasswordRequest)
                Log.d("GoogleCredentialModule", "Password saved successfully")
                promise.resolve("Password saved successfully")
            } catch (e: CreateCredentialException) {
                Log.e("GoogleCredentialModule", "Failed to save password", e)
                promise.reject("SAVE_FAILED", e.message)
            }
        }
    }

    @ReactMethod
    fun createPasskey(requestJson: String, preferImmediatelyAvailableCredentials: Boolean,promise: Promise) {
        val createPublicKeyCredentialRequest = CreatePublicKeyCredentialRequest(
            requestJson = requestJson,
            preferImmediatelyAvailableCredentials = preferImmediatelyAvailableCredentials,
        )
        // Execute CreateCredentialRequest asynchronously to register credentials
        // for a user account. Handle success and failure cases with the result and
        // exceptions, respectively.

        val activity = currentActivity
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "Activity is null")
            return
        }

        CoroutineScope(Dispatchers.IO).launch{
            try {
                val result = credentialManager.createCredential(
                    context = activity,
                    request = createPublicKeyCredentialRequest,
                )
                promise.resolve(result)
            } catch (e : CreateCredentialException){
                //handle error
                promise.reject("CreateCredentialException", "CreateCredentialException")
            }
        }
    }

    @ReactMethod
    fun getCredentials(promise: Promise) {
        val getPasswordOption = GetPasswordOption()

        // Get passkey from the user's public key credential provider.
        val getPublicKeyCredentialOption = GetPublicKeyCredentialOption(
            requestJson = requestJson
        )

        val getCredRequest = androidx.credentials.GetCredentialRequest(
            listOf(getPasswordOption,getPublicKeyCredentialOption)
        )

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val activity = currentActivity // Get the React Native Activity
                if (activity == null) {
                    Log.e("GoogleCredentialManager", "Current Activity is null")
                    return@launch
                }

                val result = credentialManager.getCredential(
                    context = activity,  // Ensure this is a valid Activity context
                    request = getCredRequest
                )
                handleSignIn(result,promise)
            } catch (e: GetCredentialException) {
                Log.e("CredentialManager", "No credential available", e)
                promise.reject("NO_CREDENTIALS", "No credentials found")
            }
        }
    }

    private fun handleSignIn(result: GetCredentialResponse, promise: Promise) {
        val credential = result.credential
        val map: WritableMap = Arguments.createMap()

        when (credential) {
            is PublicKeyCredential -> {
                map.putString("type", "passkey")
                map.putString("response", credential.authenticationResponseJson)
            }
            is PasswordCredential -> {
                map.putString("type", "password")
                map.putString("username", credential.id)
                map.putString("password", credential.password)
            }
            else -> {
                promise.reject("UNKNOWN_CREDENTIAL", "Unknown credential type")
                return
            }
        }

        promise.resolve(map)
    }
}