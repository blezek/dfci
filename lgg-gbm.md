# LLG GBM Classification

Link for the LGG segmentations (yes, it is that long):

https://public.boxcloud.com/d/1/ZKFlAqqBbZOHxGLVdV45eGufv7Wi_DXJptrFWJ2CvvoZ9g5nCbeAF7t9zAB-slye9GPNuVAENtrWRaGZvrPGrFmh4xLh3OHn5zBjx64aCriJHXdLnxur0CpDaOcK1vqTjF1jrfG_c1MhPb3j8LTqQGFLdbXVm2s-4A5aUWH7PxLbn6hXON69mq_OiAHF6gg5W_sXr2d1UdKr1Nf9zVSQt4gUGOtLeAkj5rnUZwT9hf2y4JQI7sFnLJ4ikQxDJ0M1fZr-4oQE1ALohvnwUEGiwmKQ3Jx8zn5deW5tkI2UjIeJiAW-SbxyZFw19TGQAAnEmQT1_URosTQbFp0sreVjOMw5-bX08ebiIxn13EULjmQtH6_RvGHUsdxCjs52RbzJUrLVElQLnVsmUeHS7fLXmevAqH98iuZXdtiObRjgrzgo2XlDgQ3BdmeHhuZhBaX6HVp6vgLY3_N_ccQk5KCvSCwHRFusJEuN6MRBGx3Avt2102nonjzD50o1UBubSDeFa-sclUFDgjt4AYzhN_GErSZaXRxz58YcMf2L2BSQG4tWQw-giskz5nPZMML1iU4hCRZT72VCi6o7A2xPYXkXcP5QOkh2C2A8NuHJhozLe7yKqUIaUPwKmj9z_rJ849ooI-A37luFVR_8aLl7HercL_S21MgCM-jJqZgy4-NjjFReTJAl680h6omxC9C9lEgy5vjI6KVD7FoO03xBJkUqrM8MqnW2nGqLOmcvJUdTvBsaion3lklNagifPmaGoKWfsAfq8CLPwSi2E0GiPLGs27bnuj6nmSDlBpWTkhpQZ9x42PeiHrxxH5qfHxyGcdsvySuW83_xc43P8pCO7aCeGiaskje6ib9f_tmreDtIlNwlg_KQe3Y-50Ev9mEOMdd9Mitp0ai8f-2JlzlJHt6mZ4IC9E7vJXA9UMdS9KuDqAw02BFYRRcTHaVa2rdIscp_AjG-Mh1RRFwEJLghnYz_gKAL4RBAk8XJmwG-nUWnbFBmbziCw_kiBfBmKjBWcQVNPz3usKefKZjPSOTQbWF0NEKPSntKEz8aCVH-zdHNEfgdg6YMJ7jZ-bNFvYoNnsFv27jy7HHExPuA6_DfX6D3HlhBORzip3En9QdW/download

Cases

https://wiki.cancerimagingarchive.net/download/attachments/25789042/TCIA_LGG_cases_159.xlsx?version=1&modificationDate=1509045953290&api=v2


## helpful packages

https://github.com/broadinstitute/keras-resnet


## Running

```
export LD_LIBRARY_PATH=/usr/local/cuda/lib64/
./miniconda/bin/jupyter-notebook --no-browser --ip 0.0.0.0 
```

# Command line usage

Setup miniconda by

```sh
source miniconda/bin/activate root
```

## Compile and install ANTs

```sh
sudo yum install -y cmake3
cd Source
git clone https://github.com/ANTsX/ANTs.git
mkdir ANTs-build
cd ANTs-build
cmake3 ../ANTs
make -j 12

( cd ANTS-build && sudo make install )
```

## Process

```sh
source miniconda/bin/activate root
# preprocess
mkdir -p ~/Data/test/ ~/Data/temp/
python preprocess subjects LGG-GBM/TCIA_LGG_cases_159.xlsx subjects.json
jq -r '.subjects[].id' subjects.json | parallel -j 10 --progress --eta python ./preprocess image  --temp-dir ~/Data/temp --debug ~/Data/NiFTiSegmentationsEdited/ {} ~/Data/test/

# Start training
python train train $HOME/Data/test --batch-size 64 --epochs 3000 subjects.json weights.h5

```



# Results

## Resnet 18

```sh
python train train $HOME/Data/test --batch-size 64 --epochs 3000 --model resnet18 subjects.json weights.h5
```

Seems to over-fit, as loss kept going down, accuracy hit a plateau, and validation accuracy bounced around.


```sh
for model in resnet18 resnet34 resnet50 resnet101 resnet152 resnet200; do
    python train train $HOME/Data/test --batch-size 64 --epochs 3000 --model $model subjects.json weights.h5 | tee $model.log
done
```

