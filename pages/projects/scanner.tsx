import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Group,
  LoadingOverlay,
  Modal,
  Stack,
  Text,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconCameraRotate } from '@tabler/icons-react'
import { CameraDevice, Html5Qrcode, Html5QrcodeResult } from 'html5-qrcode'
import React from 'react'

import AppLayout from '@/layouts/AppLayout'

function Scanner() {
  const [loading, setLoading] = React.useState(true)
  const [cameras, setCameras] = React.useState<CameraDevice[]>()
  const [currentCamera, setCurrentCamera] = React.useState<CameraDevice>()
  const [scannedResult, setScannedResult] = React.useState<Html5QrcodeResult>()
  const html5QrCode = React.useRef<Html5Qrcode>()

  const camerasLenght = cameras?.length || 0
  const isResultUrl = scannedResult?.result.decodedTextType === 1
  const modalTitle = `${isResultUrl ? 'Url' : 'Text'} decoded`

  const [opened, { open, close }] = useDisclosure(false)

  const onScanSuccess = React.useCallback(
    (_: string, decodedResult: Html5QrcodeResult) => {
      setScannedResult(decodedResult)
      open()
    },
    [open],
  )

  const onSwitchCamera = React.useCallback(() => {
    setCurrentCamera((prev) => cameras?.filter(({ id }) => id !== prev?.id)[0])
  }, [cameras])

  const onShare = React.useCallback(() => {
    const sharedData = isResultUrl
      ? { url: scannedResult?.decodedText }
      : { text: scannedResult?.decodedText }

    navigator.share(sharedData)
  }, [isResultUrl, scannedResult?.decodedText])

  const onOpen = React.useCallback(() => {
    window.open(scannedResult?.decodedText, '_blank')
  }, [scannedResult?.decodedText])

  React.useEffect(() => {
    async function getCameras() {
      setLoading(true)

      const devices = await Html5Qrcode.getCameras()

      if (devices?.length) {
        setCameras(devices)

        const backCamera = devices.find(({ label }) => label.includes('back'))

        setCurrentCamera(backCamera || devices[0])
      }
    }

    getCameras()
  }, [])

  React.useEffect(() => {
    if (!currentCamera?.id) return

    html5QrCode.current = new Html5Qrcode('camera-containter')

    html5QrCode.current.start(
      currentCamera?.id,
      { fps: 10 },
      onScanSuccess,
      (errorMessage) => {},
    )

    setLoading(false)

    return () => {
      html5QrCode.current?.stop()
    }
  }, [currentCamera?.id, onScanSuccess])

  return (
    <AppLayout title="Scanner">
      <Modal
        opened={opened}
        onClose={close}
        title={modalTitle}
        size="sm"
        centered>
        {isResultUrl ? (
          <Anchor target="_blank" href={scannedResult.decodedText}>
            {scannedResult.decodedText}
          </Anchor>
        ) : (
          <Text>{scannedResult?.decodedText}</Text>
        )}
        <Group grow>
          <Button variant="default" onClick={onShare}>
            Share
          </Button>
          {isResultUrl && (
            <Button variant="filled" onClick={onOpen}>
              Open
            </Button>
          )}
        </Group>
      </Modal>
      <Stack justify="center" style={{ flex: 1 }} align="center">
        <Box
          id="camera-containter"
          sx={(theme) => ({
            boxShadow: theme.shadows.md,
            borderRadius: theme.radius.md,
            overflow: 'hidden',
            visibility: loading ? 'hidden' : undefined,
          })}
          m="lg"
          w="100%"
        />
        <LoadingOverlay
          overlayOpacity={0}
          transitionDuration={500}
          visible={loading}
        />
        {camerasLenght > 1 && (
          <ActionIcon
            color="blue"
            size="xl"
            radius="xl"
            variant="filled"
            onClick={onSwitchCamera}
            m="lg">
            <IconCameraRotate size="2.125rem" />
          </ActionIcon>
        )}
      </Stack>
    </AppLayout>
  )
}

export default React.memo(Scanner)
