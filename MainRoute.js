import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";

import { useRoute } from "./router";
import { authStateChanged } from "./redux/auth/authOperations";

const MainRoute = () => {
    const { stateChange } = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(authStateChanged());
    }, []);

    const routing = useRoute(stateChange);

    return <NavigationContainer>{routing}</NavigationContainer>;
};

export default MainRoute;