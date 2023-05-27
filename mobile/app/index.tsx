import { BaiJamjuree_700Bold } from "@expo-google-fonts/bai-jamjuree";
import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import NLWLogo from "../src/assets/nlw-logo.svg";
import { api } from "../src/lib/api";

const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint:
    "https://github.com/settings/connections/applications/c8512692946dc4f7e98c",
};

export default function App() {
  const router = useRouter();

  const [hasLoadedFonts] = useFonts({
    Roboto_700Bold,
    Roboto_400Regular,
    BaiJamjuree_700Bold,
  });

  const [, response, signInWithGitHub] = useAuthRequest(
    {
      clientId: "c8512692946dc4f7e98c",
      scopes: ["identity"],
      redirectUri: makeRedirectUri({
        scheme: "nlwspacetime",
      }),
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      api
        .post("/register", {
          code,
        })
        .then((response) => {
          const { token } = response.data;

          SecureStore.setItemAsync("token", token);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [response]);

  if (!hasLoadedFonts) {
    return null;
  }

  return (
    <View className="items-center flex-1 px-8 py-10 ">
      <StatusBar style="light" translucent />
      
      <View className="items-center justify-center flex-1 gap-6">
        <NLWLogo />
        <View className="space-y-2">
          <Text className="text-2xl leading-tight text-center text-gray-100 font-title">
            Sua cápsula do tempo
          </Text>
          <Text className="text-base leading-relaxed text-center text-gray-200 font-body">
            Coleciopone momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="px-5 py-2 bg-green-500 rounded-full"
          onPress={() => signInWithGitHub()}
        >
          <Text className="text-sm text-black uppercase font-alt">
            Cadastrar lembraça
          </Text>
        </TouchableOpacity>
      </View>
      <Text className="text-sm leading-relaxed text-center text-gray-200 font-body">
        Feito com 💜 por Thiago Mendes no NLW da Rocketseat{" "}
      </Text>
    </View>
  );
}
