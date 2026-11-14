---
license: mit
library_name: transformers.js
base_model: ZhengPeng7/BiRefNet_lite
pipeline_tag: image-segmentation
tags:
  - background-removal
  - onnx
  - webgpu
---

# BiRefNet lite, ONNX for WebGPU

[BiRefNet lite](https://huggingface.co/ZhengPeng7/BiRefNet_lite) for background removal, rebuilt so it runs on WebGPU in the browser. The weights are unchanged. Only the graph was rewritten, starting from [onnx-community/BiRefNet_lite-ONNX](https://huggingface.co/onnx-community/BiRefNet_lite-ONNX).

The stock export doesn't run on WebGPU. Some of its shaders need more storage buffers than a GPU allows (WebGPU only promises 8 per shader), and its int64 index maths and `Sum` nodes have no WebGPU kernels, so they fall back to the CPU with very large tensors.

| File | Precision | Size |
|---|---|---|
| `onnx/model.onnx` | fp32 | 245 MB |
| `onnx/model_fp16.onnx` | fp16 weights, float32 input and output | 123 MB |

Input `input_image`: float32 `[1, 3, 1024, 1024]`, RGB resized to 1024 x 1024, scaled to 0..1, then ImageNet mean `[0.485, 0.456, 0.406]` and std `[0.229, 0.224, 0.225]`.
Output `output_image`: float32 `[1, 1, 1024, 1024]` logits. Apply a sigmoid to get the alpha mask.

## What was changed

1. **Constant folding** with ONNX Runtime's basic optimizer, which only produces standard ONNX ops. It takes the graph from 16,400 to 4,083 nodes and removes every shape op, `ScatterND`, `Where` and `ConstantOfShape`.
2. **4 `Concat` nodes** with 16, 64, 256 and 1024 inputs became trees with at most 6 inputs each.
3. **59 `Split` nodes** with up to 32 outputs became trees with at most 6 outputs each.
4. **20 `Sum` nodes** became chains of `Add` in the same order, so the result stays bit-identical.
5. **80 `GatherND` nodes** (the sampling in the deformable convolutions) became a plain `Gather` on the data reshaped to `[H*W, C]`. Their index maths, which was int64, now runs in float (the values are whole numbers), then `y * W + x` is taken in int32. No int64 tensor is left in the graph. Doing the last step in int32 also keeps the index exact in the fp16 model.
6. **fp16:** converted with `onnxconverter-common` and `keep_io_types`, so input and output stay float32.

Every node now uses at most 7 storage buffers, under the WebGPU minimum of 8.

## Results

On the CPU (ONNX Runtime 1.31, three test images: hair, a car and two cats), compared with the original onnx-community fp32 model:

| File | Logits | Alpha mask |
|---|---|---|
| `model.onnx` | bit-identical, max difference 0.0 | identical |
| `model_fp16.onnx` | max difference 0.04 to 0.48 | mean difference about 1e-5, at most 0.07% of pixels move by more than 1/255 |

On WebGPU (Chrome 155, AMD Radeon RX 9070 XT, Transformers.js 4.3.1 with ONNX Runtime Web 1.31.0-dev.20260914), `model_fp16.onnx` on the same three inputs:

- About 500 ms per image once warm, about 1.8 s to load.
- 0.5% to 1.4% of pixels move by more than 1/255 from the fp32 CPU result, and 0.01% to 0.02% of pixels change between inside and outside, all of them on edges.

## Use it

With Transformers.js:

```js
import { AutoModel, AutoProcessor, RawImage } from "@huggingface/transformers";

const model = await AutoModel.from_pretrained("wonfy/BiRefNet_lite-ONNX-webgpu", {
  device: "webgpu",
  dtype: "fp32",
  model_file_name: "model_fp16", // leave this out for the fp32 file
});
const processor = await AutoProcessor.from_pretrained("wonfy/BiRefNet_lite-ONNX-webgpu");

const image = await RawImage.fromURL("photo.jpg");
const { pixel_values } = await processor(image);
const { output_image } = await model({ input_image: pixel_values });
// alpha = sigmoid(output_image.data[i]), at 1024 x 1024
```

`dtype: "fp32"` with `model_file_name: "model_fp16"` is the combination that was tested. It loads the fp16 file as it is.

With ONNX Runtime Web directly, create an `InferenceSession` from either file with `executionProviders: ["webgpu"]`.

## Rebuild it

The scripts are in `scripts/`. They were run with Python 3.13, onnx 1.23.2, onnxruntime 1.31.0, onnxconverter-common 1.16.0, numpy and Pillow.

```
python scripts/fold.py model.onnx folded.onnx
python scripts/patch.py folded.onnx onnx/model.onnx
python scripts/to_fp16.py onnx/model.onnx onnx/model_fp16.onnx
python scripts/verify.py samples/ results/ model.onnx onnx/model.onnx onnx/model_fp16.onnx
```

`model.onnx` in the first line is the fp32 file from onnx-community/BiRefNet_lite-ONNX. `patch.py` prints an audit at the end: the most storage buffers any node uses, and any op still producing int64.

## Licence

MIT, the same as BiRefNet. See `LICENSE`. BiRefNet is by Peng Zheng et al., [paper](https://arxiv.org/abs/2401.03407) and [code](https://github.com/ZhengPeng7/BiRefNet).

BiRefNet lite's training data includes DIS5K, and DIS5K's own terms restrict commercial use of the dataset. The MIT licence covers the model and code, not the training data. Check what that means for your use.
