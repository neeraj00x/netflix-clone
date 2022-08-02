import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import db from '../firebase';
import { addDoc, collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import './PlansScreen.css';
import { loadStripe } from '@stripe/stripe-js';

export default function PlansScreen() {
    const [products, setProducts] = useState([]);
    const user = useSelector(selectUser);
    const [subscription, setSubscription] = useState(null);

    useEffect(() => {
        const q = query(collection(db, "customers", user.uid, 'subscriptions'));
        async function fetchSubscription() {
            const docSnap = await getDocs(q);

            docSnap.forEach(async subscription => {
                setSubscription({
                    role: subscription.data().role,
                    current_period_end: subscription.data().current_period_end.seconds,
                    current_period_start: subscription.data().current_period_start.seconds,
                });
            });
        }
        fetchSubscription();
        // db.collection('customers')
        //     .doc(user.uid)
        //     .collection('subscriptions')
        //     .get()
        //     .then(querySnapshot => {
        //         querySnapshot.forEach(async subscription => {
        //             setSubscription({
        //                 role: subscription.data().role,
        //                 current_period_end: subscription.data().current_period_end.seconds,
        //                 current_period_start: subscription.data().current_period_start.seconds,
        //             });
        //         });
        //     });

    }, [user.uid]);

    useEffect(() => {
        const q = query(collection(db, "products"), where('active', '==', true));

        async function fetchProducts() {
            const querySnapshot = await getDocs(q)

            const products = {};
            querySnapshot.forEach(async productDoc => {
                products[productDoc.id] = productDoc.data();

                const priceSnap = await getDocs(collection(productDoc.ref, "prices"));
                priceSnap.docs.forEach(price => {
                    products[productDoc.id].prices = {
                        priceId: price.id,
                        priceData: price.data()
                    };
                });
            });
            setProducts(products);
        }
        fetchProducts();

    }, []);

    console.log(products);

    const loadCheckout = async (priceId) => {
        const q = query(collection(db, "customers", user.uid, 'checkout_sessions'));
        const docRef = await addDoc(q, {
            price: priceId,
            success_url: window.location.origin,
            cancel_url: window.location.origin,
        })

        // const docRef = await db
        //     .collection("customers")
        //     .doc(user.uid)
        //     .collection("checkout_sessions")
        //     .add({
        //         price: priceId,
        //         success_url: window.location.origin,
        //         cancel_url: window.location.origin,
        //     });

        onSnapshot(docRef, async (snap) => {
            const { error, sessionId } = snap.data();

            if (error) {
                alert(`An error has occured ${error}`);
            }

            if (sessionId) {
                const stripe = await loadStripe(
                    'pk_test_51LK8C3SBIpBrEB49gissPM0Wprygry1glopIXSNod1urZwuFpMUpMMQHFawv6vbPqbEKTS6Rwszg6w3zUT2iLjyf00VWDlHkoW'
                );

                stripe.redirectToCheckout({ sessionId });
            }
        });
    };

    return (
        <div className="plansScreen">
            <br />
            {subscription &&
                <p>Renewal date: {new Date(subscription?.current_period_end * 1000).toLocaleDateString()}</p>}

            {Object.entries(products).map(([productId, productData]) => {

                const isCurrentPackage = productData.name?.toLowerCase().includes(subscription?.role);

                return (
                    <div
                        key={productId}
                        className={`${isCurrentPackage && "plansScreen_plan--disabled"} plansScreen_plan`} >

                        <div className="plansScreen_info">
                            <h5>{productData.name}</h5>
                            <h6>{productData.description}</h6>
                        </div>

                        <button
                            onClick={() =>
                                !isCurrentPackage && loadCheckout(productData.prices.priceId)}
                        >
                            {isCurrentPackage ? "Current Package" : "Subscribe"}
                        </button>
                    </div>
                );
            })}
        </div >
    )
}