import AsyncStorage from "@react-native-async-storage/async-storage"
import { load, loadString, save, saveString, clear, remove, getAllKeys } from "./storage"

const VALUE_OBJECT = { x: 1 }
const VALUE_STRING = JSON.stringify(VALUE_OBJECT)

describe("AsyncStorage", () => {
  beforeEach(async () => {
    await AsyncStorage.clear()
    await AsyncStorage.setItem("string", "string")
    await AsyncStorage.setItem("object", JSON.stringify(VALUE_OBJECT))
  })

  it("should be defined", () => {
    expect(AsyncStorage).toBeDefined()
  })

  it("should have default keys", async () => {
    const keys = await getAllKeys()
    expect([...keys].sort((a, b) => a.localeCompare(b))).toEqual(["object", "string"])
  })

  it("should load data", async () => {
    expect(await load<object>("object")).toEqual(VALUE_OBJECT)
    expect(await loadString("object")).toEqual(VALUE_STRING)

    expect(await load<string>("string")).toEqual("string")
    expect(await loadString("string")).toEqual("string")
  })

  it("should save strings", async () => {
    await saveString("string", "new string")
    expect(await loadString("string")).toEqual("new string")
  })

  it("should save objects", async () => {
    await save("object", { y: 2 })
    expect(await load<object>("object")).toEqual({ y: 2 })
    await save("object", { z: 3, also: true })
    expect(await load<object>("object")).toEqual({ z: 3, also: true })
  })

  it("should save strings and objects", async () => {
    await saveString("object", "new string")
    expect(await loadString("object")).toEqual("new string")
  })

  it("should remove data", async () => {
    await remove("object")
    expect(await load<object>("object")).toBeNull()
    const keys1 = await getAllKeys()
    expect([...keys1].sort((a, b) => a.localeCompare(b))).toEqual(["string"])

    await remove("string")
    expect(await load<string>("string")).toBeNull()
    const keys2 = await getAllKeys()
    expect(keys2).toEqual([])
  })

  it("should clear all data", async () => {
    const keys1 = await getAllKeys()
    expect([...keys1].sort((a, b) => a.localeCompare(b))).toEqual(["object", "string"])
    await clear()
    const keys2 = await getAllKeys()
    expect(keys2).toEqual([])
  })
})
