# Processing

Create the Makefile using `ganef`

```
~/Source/ganef/bin/ganef /Volumes/External/ADNI/adni.db ~/Source/dfci/M.template > /Volumes/External/ADNI/adni.mk
```

```
cd /Volumes/External/ADNI
make -f adni.mk
```

# Inevitable problems

`mkdir -p quarantine`

## 006_S_0681

The image `006_S_0681/2006-08-31_13_50_35.0-S18450-image.nii.gz` is `256x256x124`, but the segmentation `006_S_0681/2006-08-31_13_50_35.0-S18450-mask-prep.nii.gz` is `256x256x166`, and nothing works.

Delete the problem image:

```
sqlite3 adni.db "delete from adni where subject = '006_S_0681' and type = 'MP-RAGE_REPEAT' and date = '2006-08-31_13_50_35.0'"
sqlite3 adni.db "delete from adni where subject = '133_S_1170' and series = 'S24672'"
make -f adni.mk clean-006_S_0681
```

