# OxyModal
Simple lightweight modal windows hook

## Usage
1. Add `ModalProvider` to your main.js:
    ```jsx
    <StrictMode>
        <ModalProvider>
            <App/>
        </ModalProvider>
    </StrictMode>
    ```
2. Import default styles:
    `import 'oxymodal/dist/default.css'`
3. Create modal window function like this:
    ```jsx
    const modalContent = (close) => <>
        <h1>Some title</h1>
        {/*Content*/}
        <button onClick={()=>close("important data")}>Close</button>
    </>;
    ```
4. Using `useModal` hook, call:
```js
modal.open(modalContent, (data)=>console.log(data));
```