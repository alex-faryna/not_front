import {useNavigate, useParams} from "react-router";
import {useEffect} from "react";
import {backButton} from "@telegram-apps/sdk-react";
import {Button} from "@/components/ui/button.tsx";

export function ItemPage() {
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (backButton.show.isAvailable()) {
      backButton.show();
    }

    const offClick = backButton.onClick(() => navigate('/', { viewTransition: true }));

    return () => {
      if (backButton.hide.isAvailable()) {
        offClick();
        backButton.hide();
      }
    }
  }, []);

  return <div>
    <span>Heello item { params.itemId }</span>
    <Button>Click me</Button>
  </div>
}