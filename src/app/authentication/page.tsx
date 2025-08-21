import { Header } from "@/components/common/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCategories } from "@/helpers/categories";
import { getCategoriesByGender } from "@/helpers/gender-categories";

import SignInForm from "./components/sign-in-form";
import SignUpForm from "./components/sign-up-form";

const Authentication = async () => {
  const [categories, genderCategories] = await Promise.all([
    getCategories(),
    getCategoriesByGender(),
  ]);
  return (
    <>
      <Header categories={categories} genderCategories={genderCategories} />

      <div className="flex w-full flex-col gap-6 p-5 pt-25">
        <Tabs defaultValue="sign-in">
          <TabsList className="bg-primary/10 border-primary/20 rounded-full">
            <TabsTrigger
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full"
              value="sign-in"
            >
              Entrar
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full"
              value="sign-up"
            >
              Criar conta
            </TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in" className="w-full">
            <SignInForm />
          </TabsContent>
          <TabsContent value="sign-up" className="w-full">
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Authentication;
