---
title: Building custom iOS views in Swift
description: Three step-by-step recipes for custom views in Swift, a passcode input, a draggable bottom menu and circular text in SwiftUI, each built from gestures, input handling or geometry.
slug: swift-custom-view-recipes
kind: reference
announce: false
date: 2019-06-22
authors:
  - tieubao
tags:
  - swift
  - ios
  - swiftui
  - uikit
redirect:
  - /research/topics/mobile/build-a-passcode-view-with-swift
  - /vvAbZg
  - /research/topics/mobile/reproduce-apple-find-me-bottom-menu-view
  - /nLXzZQ
  - /research/topics/mobile/create-circular-text-using-swiftui
  - /ZO408w
---

Each recipe below builds one custom view from a small set of primitives. The passcode view takes keyboard input and maps it to dots. The bottom menu follows a drag gesture and snaps between heights. The circular text measures each character and rotates it around a circle. The first two use UIKit, the third uses SwiftUI. Each recipe links to its full source code.

## Passcode view

The passcode view can `becomeFirstResponder` and `resignFirstResponder` to show and hide the virtual keyboard when needed. That makes it behave much like a `TextField`.

![Finished passcode view with PIN dots](assets/build-a-passcode-view-with-swift_38059dcec9bd2edb9ac9b1433eb8870c_md5.webp)

Define the passcode view:

![Passcode view class definition](assets/build-a-passcode-view-with-swift_d816501201514ad7e20b8a1eaa11336b_md5.webp)

### Show the keyboard

By default, the user must touch a `TextField` or `TextView` to show the keyboard. A custom view becomes a keyboard input view when it overrides `canBecomeFirstResponder` and conforms to the `UIKeyInput` protocol.

![Overriding canBecomeFirstResponder](assets/build-a-passcode-view-with-swift_e3aac2ef700961b85e15edbeba660e97_md5.webp)

![Conforming to UIKeyInput](assets/build-a-passcode-view-with-swift_e1f29ff96dcff1eabdaa75703feccaa7_md5.webp)

Now the view can show the keyboard. Test it by calling `passcode.becomeFirstResponder()`.

![Calling becomeFirstResponder in a test](assets/build-a-passcode-view-with-swift_3af95d69a2b12d37965a6390e9ffc9e3_md5.webp)

![Keyboard shown by the passcode view](assets/build-a-passcode-view-with-swift_af46d74372514e5a70b084d86b836f5e_md5.webp)

To make the view easy to use, add a tap gesture that calls `becomeFirstResponder()`. Now a tap shows the keyboard.

![Tap gesture that shows the keyboard](assets/build-a-passcode-view-with-swift_f2662e927b3487cb814b59e5b4fb6ab7_md5.webp)

### Handle the input

The input logic centers on three methods:

![The three UIKeyInput methods](assets/build-a-passcode-view-with-swift_e1f29ff96dcff1eabdaa75703feccaa7_md5.webp)

Append to or delete from the code string as needed:

![Appending and deleting characters in the code string](assets/build-a-passcode-view-with-swift_1ca05e855a002b1a9b9062933c0637c3_md5.webp)

### Map the code to PIN dots

With the logic finished, the next challenge is mapping the code to a PIN UI when the code changes. Add a `UIStackView` to the passcode view. The stack distributes "dot views" as the PIN.

![Adding a UIStackView to the passcode view](assets/build-a-passcode-view-with-swift_dc6fae0f3fb25101d24553d424836965_md5.webp)

![Stack view layout for the PIN dots](assets/build-a-passcode-view-with-swift_36906b8962ed020434fa08918abb4452_md5.webp)

Create the PIN view:

![PIN view definition](assets/build-a-passcode-view-with-swift_9538b2b34f1286a8dc0ea3af0754f8e6_md5.webp)

Create two helper methods, one for an empty pin and one for a normal pin:

![Helper methods for empty and filled pins](assets/build-a-passcode-view-with-swift_9f05b8d51b192d5084b13c8c58a5f154_md5.webp)

Map the user's input code to an array of pin views and distribute them in the stack:

![Mapping the code to an array of pin views](assets/build-a-passcode-view-with-swift_bb4c7b4c744eb9753d14c80f90713861_md5.webp)

Add a helper method that removes all arranged subviews from the stack:

![Helper that removes all arranged subviews](assets/build-a-passcode-view-with-swift_d44d2498c831ac60ddbf0a53d5f34234_md5.webp)

Call the stack update when the code changes:

![Updating the stack when the code changes](assets/build-a-passcode-view-with-swift_f4f7c7feb4ec4c1c638d716f2d270e5a_md5.webp)

### Test and finish

Create a view controller to test the stack:

![View controller used to test the passcode view](assets/build-a-passcode-view-with-swift_0f668d3c9f621a372a90657247d08e3a_md5.webp)

Make `PasscodeView` conform to `UITextInputTraits` so you can set the keyboard to the number pad:

![Conforming to UITextInputTraits for a number pad](assets/build-a-passcode-view-with-swift_c7b65095335c11d1ffa2865322c3e686_md5.webp)

Result:

![Passcode view result with number pad](assets/build-a-passcode-view-with-swift_e0a5e31e6ae8c460f9968793cf29003e_md5.webp)

Add a callback for when the user finishes the input:

![Completion callback code](assets/build-a-passcode-view-with-swift_804017aefbe5ae510c9ea2cc7445e8f8_md5.webp)

![Using the completion callback](assets/build-a-passcode-view-with-swift_383a2f3f5d10e682fdb546b70166a178_md5.webp)

Full source code: [Passcode on GitHub](https://github.com/viettrungphan/Passcode.git?source=post_page-----a6ddae69f405----------------------). The project was written in Xcode 11 beta. Copy all the `Passxxx` and `Pin` files into your Xcode project to test.

## Draggable bottom menu

This recipe recreates the bottom menu of Apple's Find My app in a few lines of code. The device list menu has three states: collapsed, half expanded and expanded.

![The three bottom menu states: collapsed, half expanded and expanded](assets/reproduce-apple-find-me-bottom-menu-view_da7e32fb18ad8af53dffd592a0e683f5_md5.webp)

The view needs to do two things:

1. Update its own height to follow the user's finger while dragging (pan gesture).
2. Resize its height automatically, based on the direction of the drag and the position compared to the "half position".

### Set up the view

Create an Xcode project and add a new `UIView` named `BottomMenuView`.

Add a `PanView` as a subview of `BottomMenuView`. Constrain its leading, trailing and top edges to the superview and set the height constraint to 44.0. The `PanView` tracks the user's finger with a `UIPanGestureRecognizer`.

![PanView constraints inside BottomMenuView](assets/reproduce-apple-find-me-bottom-menu-view_dabaf075b757602a5af2c6bfcead3283_md5.webp)

Add a bottom constraint for the `PanView`, and make outlets for the `PanView` and the bottom constraint. Xcode may warn about conflicting constraints, which is fine.

![Outlets for the PanView and its bottom constraint](assets/reproduce-apple-find-me-bottom-menu-view_8fbb0902507f83afa2b0ef1bc5f830a0_md5.webp)

### Write the code

Define some variables to set the menu heights:

![Variables for the menu heights](assets/reproduce-apple-find-me-bottom-menu-view_8a481af07dd3642e0a3001689f596f77_md5.webp)

Add a pan gesture to the `panView` and handle the pan event:

![Adding and handling the pan gesture](assets/reproduce-apple-find-me-bottom-menu-view_ab8aae75b6f84f7d28901126d81f38d0_md5.webp)

Update the menu height based on the drag direction and position:

![Updating the menu height by drag direction and position](assets/reproduce-apple-find-me-bottom-menu-view_e66f07cbd639a062efd2fc0a52315a9c_md5.webp)

Set up the UI and the initial menu height in `awakeFromNib`:

![Setting up the UI in awakeFromNib](assets/reproduce-apple-find-me-bottom-menu-view_11c6fff8357d4f0172bb2ecf6a315d63_md5.webp)

Finally, test the menu by adding it to a view controller:

![Adding the menu to a view controller](assets/reproduce-apple-find-me-bottom-menu-view_f864eb297f5f2ff0a55adc3876a07a3c_md5.webp)

![Bottom menu running in the test project](assets/reproduce-apple-find-me-bottom-menu-view_097b369938a9fd77abad168060e62307_md5.webp)

Full source code: [BottomMenu on GitHub](https://github.com/viettrungphan/BottomMenu.git).

## Circular text in SwiftUI

This recipe lays text along a circle in SwiftUI.

![Finished circular text](assets/create-circular-text-using-swiftui_6872696f92cc278214818c3e90f67383_md5.webp)

Open Xcode, create a new SwiftUI project, and add a new SwiftUI file named `CircularText`. The first two attributes of the control are the string and the radius of the circle.

![The string and radius attributes](assets/create-circular-text-using-swiftui_9b6a81fbaea69fbc04804680517f7628_md5.webp)

### Split the string

To make circular text, split the string into an array of characters. Each character gets its own `Text` control, and each control is rotated to match the circle. Define a computed property that splits the string into an array of characters:

![Computed property that splits the string into characters](assets/create-circular-text-using-swiftui_46724b5601eab5c6899e4444f5729480_md5.webp)

Use `enumerated` to get the offset, which is needed later.

### Compute the angle

To calculate the rotation angle you need two things: the perimeter of the circle and the width of each character.

![Perimeter of the circle](assets/create-circular-text-using-swiftui_d850c4e1905c1fe203887a585b99beb0_md5.webp)

The perimeter is used later through `radius.perimeter`.

The width of each character is harder. The character must sit in some control, and the control must report its size. `Text` is the best candidate. Embed the `Text` and a `Spacer` in a `VStack`. This gives a custom control as tall as the parent view, with the text at the top, which makes rotation easy because you only need to rotate around the center of the control.

![VStack with Text and Spacer for each character](assets/create-circular-text-using-swiftui_c8ece1efb4286be7223bcb132a0e1257_md5.webp)

Now there is a list of `Text` views and the next step is getting each width. SwiftUI lets you read a control's size with `GeometryReader`, and you send it outside the view with a `PreferenceKey`.

![GeometryReader and PreferenceKey code](assets/create-circular-text-using-swiftui_1f272824a0e403cad5a4d5a45fe5c91f_md5.webp)

Place the custom `Sizeable` view as the background of the `Text`. A `Sizeable` view is actually a `Color`, so it fills its parent (the background of the `Text`) and reports exactly the size of the `Text`. To store the sizes, add a dictionary named `textSizes`. The key is the position of the character.

![The textSizes dictionary](assets/create-circular-text-using-swiftui_9f748f21526907df2f65cfa50b2b3526_md5.webp)

Update the `VStack`s to save the sizes when the preference changes:

![Saving sizes when the preference changes](assets/create-circular-text-using-swiftui_068016d599ac0fe7ebeb1c320496fea9_md5.webp)

With the perimeter and each character's width, calculate the angle of each character by its position:

![Angle calculation for each character](assets/create-circular-text-using-swiftui_62ae3eea7d36359b7e26f8840a74dd3d_md5.webp)

This function calculates what percentage of the perimeter the character's width takes, then derives the angle from that percentage.

### Rotate and adjust

With the angle in hand, apply the rotation and look at the result:

![Characters rotated around the circle](assets/create-circular-text-using-swiftui_f9fb1ddc68ddef8e0c9f6f321e34aaeb_md5.webp)

The spacing between characters looks wrong. It only fits horizontal text, and the rotation pushes the characters close together. The built-in `kerning` modifier adjusts the spacing.

![Adjusting spacing with the kerning modifier](assets/create-circular-text-using-swiftui_fdd18ae3a8fd903729c18eda97d7ae1f_md5.webp)

To center the text, take the angle of the last character, divide it by 2, and rotate the whole text anticlockwise by that amount.

![Centered circular text](assets/create-circular-text-using-swiftui_1f24f4e09d557c69ef6b57fcc4e0ab66_md5.webp)

Full source code: [SwiftUIGeometryPractice on GitHub](https://github.com/viettrungphan/SwiftUIGeometryPractice).
